# Seeds exercises, a routine, assignment and historical workouts for Cliente Demo.
$ErrorActionPreference = 'Stop'
$base = 'http://localhost:8080/api/v1'
$tmp = Join-Path $env:TEMP 'formai-seed'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

function Write-Json($path, $obj) {
  ($obj | ConvertTo-Json -Depth 10 -Compress) | Set-Content -Path $path -Encoding ascii
}

function Invoke-Api($method, $url, $bodyPath, $cookie) {
  $out = Join-Path $tmp 'out.json'
  $hdr = Join-Path $tmp 'hdr.txt'
  $args = @('-s', '-D', $hdr, '-o', $out, '-X', $method, $url, '-H', 'Content-Type: application/json')
  if ($cookie) { $args += @('-H', "Cookie: token=$cookie") }
  if ($bodyPath) { $args += @('--data-binary', "@$bodyPath") }
  & curl.exe @args | Out-Null
  $status = (Get-Content $hdr | Select-Object -First 1)
  $body = Get-Content $out -Raw -ErrorAction SilentlyContinue
  if ($status -notmatch ' (200|201) ') {
    throw "API failed $method $url :: $status :: $body"
  }
  if ($body) { return $body | ConvertFrom-Json }
  return $null
}

function Get-Token($email, $password, $application) {
  $path = Join-Path $tmp 'signin.json'
  Write-Json $path @{ email = $email; password = $password; application = $application }
  $hdr = Join-Path $tmp 'signin.hdr'
  $out = Join-Path $tmp 'signin.out'
  curl.exe -s -D $hdr -o $out -X POST "$base/authentication/sign-in" -H 'Content-Type: application/json' --data-binary "@$path" | Out-Null
  $raw = Get-Content $hdr -Raw
  if ($raw -notmatch 'token=([^;]+)') { throw "No token for $email : $(Get-Content $out -Raw)" }
  return $Matches[1]
}

$clientId = '0319bfda-d4c7-4549-ba27-5c51b86e26a4'
$trainerToken = Get-Token 'entrenador.dev@formai.local' 'TrainerDev1!' 'WEB_PLATFORM'

# Exercises
$exDefs = @(
  @{ name = 'Press inclinado'; muscleGroup = 'Pecho'; equipment = 'Maquina' },
  @{ name = 'Remo en maquina'; muscleGroup = 'Espalda'; equipment = 'Maquina' },
  @{ name = 'Press militar'; muscleGroup = 'Hombros'; equipment = 'Maquina' }
)
$existing = Invoke-Api GET "$base/exercises?size=100" $null $trainerToken
$exerciseIds = @()
foreach ($ex in $exDefs) {
  $match = @($existing.content) | Where-Object { $_.name -eq $ex.name } | Select-Object -First 1
  if ($match) {
    $exerciseIds += $match.id
    "Reused exercise $($ex.name) -> $($match.id)"
    continue
  }
  $path = Join-Path $tmp ("ex-$($ex.name).json")
  Write-Json $path $ex
  $created = Invoke-Api POST "$base/exercises" $path $trainerToken
  $exerciseIds += $created.id
  "Created exercise $($ex.name) -> $($created.id)"
}

$e1, $e2, $e3 = $exerciseIds
$routineBody = @{
  name = 'Rutina Demo Progreso'
  sessions = @(
    @{
      label = 'Dia A - Empuje'
      exercises = @(
        @{ exerciseId = $e1; sets = 3; reps = 10; targetLoadKg = 40; restSeconds = 90 },
        @{ exerciseId = $e3; sets = 3; reps = 12; targetLoadKg = 25; restSeconds = 60 }
      )
    },
    @{
      label = 'Dia B - Tiron'
      exercises = @(
        @{ exerciseId = $e2; sets = 3; reps = 10; targetLoadKg = 45; restSeconds = 90 },
        @{ exerciseId = $e3; sets = 3; reps = 12; targetLoadKg = 25; restSeconds = 60 }
      )
    },
    @{
      label = 'Dia C - Full'
      exercises = @(
        @{ exerciseId = $e1; sets = 3; reps = 8; targetLoadKg = 45; restSeconds = 90 },
        @{ exerciseId = $e2; sets = 3; reps = 8; targetLoadKg = 50; restSeconds = 90 },
        @{ exerciseId = $e3; sets = 3; reps = 10; targetLoadKg = 30; restSeconds = 60 }
      )
    }
  )
}
$rPath = Join-Path $tmp 'routine.json'
Write-Json $rPath $routineBody
$routine = Invoke-Api POST "$base/routines" $rPath $trainerToken
$routineVersion = if ($routine.currentVersion) { [int]$routine.currentVersion } else { 1 }
"Created routine $($routine.id) v$routineVersion"

$startDate = (Get-Date).Date.AddDays(-42).ToString('yyyy-MM-dd')
$assignPath = Join-Path $tmp 'assign.json'
Write-Json $assignPath @{
  clientIds = @($clientId)
  startDate = $startDate
  trainingDays = @('MONDAY', 'WEDNESDAY', 'FRIDAY')
}
$assign = Invoke-Api POST "$base/routines/$($routine.id)/assignments" $assignPath $trainerToken
"Assigned from $startDate -> $($assign | ConvertTo-Json -Compress)"

# Historical sessions via SQL (API only schedules today)
$sql = @"
DO `$`$
DECLARE
  v_client uuid := '$clientId';
  v_routine uuid := '$($routine.id)';
  v_version int := $routineVersion;
  d date;
  sid uuid;
  day_idx int;
  labels text[] := ARRAY['Dia A - Empuje', 'Dia B - Tiron', 'Dia C - Full'];
  load1 numeric;
  load2 numeric;
  load3 numeric;
  status text;
  finished timestamp;
BEGIN
  DELETE FROM tracking.workout_sessions WHERE client_id = v_client AND scheduled_for < CURRENT_DATE;

  d := DATE '$startDate';
  WHILE d < CURRENT_DATE LOOP
    IF EXTRACT(ISODOW FROM d) IN (1, 3, 5) THEN
      day_idx := ((d - DATE '$startDate') / 2)::int % 3;
      sid := gen_random_uuid();
      -- Mix outcomes for adherence
      IF (EXTRACT(DAY FROM d)::int % 7) = 0 THEN
        status := 'SKIPPED';
        finished := NULL;
      ELSIF (EXTRACT(DAY FROM d)::int % 5) = 0 THEN
        status := 'PARTIAL';
        finished := (d + TIME '18:40')::timestamp;
      ELSE
        status := 'COMPLETED';
        finished := (d + TIME '18:45')::timestamp;
      END IF;

      load1 := 38 + (EXTRACT(WEEK FROM d)::int % 8);
      load2 := 42 + (EXTRACT(WEEK FROM d)::int % 10);
      load3 := 24 + (EXTRACT(WEEK FROM d)::int % 6);

      INSERT INTO tracking.workout_sessions
        (id, client_id, routine_id, routine_version, day_order, day_label, scheduled_for, status, finished_at)
      VALUES
        (sid, v_client, v_routine, v_version, day_idx + 1, labels[day_idx + 1], d, status, finished);

      IF day_idx = 0 THEN
        INSERT INTO tracking.workout_session_exercises VALUES
          (sid, 0, '$e1', 'Press inclinado', 3, 10, 40, 90),
          (sid, 1, '$e3', 'Press militar', 3, 12, 25, 60);
        IF status <> 'SKIPPED' THEN
          INSERT INTO tracking.workout_session_sets VALUES
            (sid, 0, '$e1', 1, load1, 10, (d + TIME '18:00')::timestamp),
            (sid, 1, '$e1', 2, load1 + 2, 9, (d + TIME '18:08')::timestamp),
            (sid, 2, '$e1', 3, load1 + 2, 8, (d + TIME '18:16')::timestamp);
          IF status = 'COMPLETED' THEN
            INSERT INTO tracking.workout_session_sets VALUES
              (sid, 3, '$e3', 1, load3, 12, (d + TIME '18:25')::timestamp),
              (sid, 4, '$e3', 2, load3, 11, (d + TIME '18:32')::timestamp),
              (sid, 5, '$e3', 3, load3 - 1, 10, (d + TIME '18:40')::timestamp);
          END IF;
        END IF;
      ELSIF day_idx = 1 THEN
        INSERT INTO tracking.workout_session_exercises VALUES
          (sid, 0, '$e2', 'Remo en maquina', 3, 10, 45, 90),
          (sid, 1, '$e3', 'Press militar', 3, 12, 25, 60);
        IF status <> 'SKIPPED' THEN
          INSERT INTO tracking.workout_session_sets VALUES
            (sid, 0, '$e2', 1, load2, 10, (d + TIME '18:00')::timestamp),
            (sid, 1, '$e2', 2, load2 + 2, 9, (d + TIME '18:10')::timestamp),
            (sid, 2, '$e2', 3, load2 + 2, 8, (d + TIME '18:20')::timestamp);
          IF status = 'COMPLETED' THEN
            INSERT INTO tracking.workout_session_sets VALUES
              (sid, 3, '$e3', 1, load3, 12, (d + TIME '18:28')::timestamp),
              (sid, 4, '$e3', 2, load3, 11, (d + TIME '18:35')::timestamp),
              (sid, 5, '$e3', 3, load3, 10, (d + TIME '18:42')::timestamp);
          END IF;
        END IF;
      ELSE
        INSERT INTO tracking.workout_session_exercises VALUES
          (sid, 0, '$e1', 'Press inclinado', 3, 8, 45, 90),
          (sid, 1, '$e2', 'Remo en maquina', 3, 8, 50, 90),
          (sid, 2, '$e3', 'Press militar', 3, 10, 30, 60);
        IF status <> 'SKIPPED' THEN
          INSERT INTO tracking.workout_session_sets VALUES
            (sid, 0, '$e1', 1, load1 + 4, 8, (d + TIME '18:00')::timestamp),
            (sid, 1, '$e1', 2, load1 + 4, 8, (d + TIME '18:08')::timestamp),
            (sid, 2, '$e2', 1, load2 + 4, 8, (d + TIME '18:18')::timestamp);
          IF status = 'COMPLETED' THEN
            INSERT INTO tracking.workout_session_sets VALUES
              (sid, 3, '$e2', 2, load2 + 4, 8, (d + TIME '18:26')::timestamp),
              (sid, 4, '$e2', 3, load2 + 5, 7, (d + TIME '18:34')::timestamp),
              (sid, 5, '$e3', 1, load3 + 2, 10, (d + TIME '18:40')::timestamp);
          END IF;
        END IF;
      END IF;
    END IF;
    d := d + 1;
  END LOOP;
END `$`$;
"@

$sqlPath = Join-Path $tmp 'seed.sql'
[System.IO.File]::WriteAllText($sqlPath, $sql)
Get-Content $sqlPath -Raw | docker exec -i formai-api-postgres-1 psql -U quedena -d formai_db
"SQL seed done"

# Complete today's session if pending
$clientToken = Get-Token 'cliente.dev@formai.local' 'ClienteDev1!' 'MOBILE_APP'
$today = Invoke-Api GET "$base/workout-sessions?page=0&size=5" $null $clientToken
$pending = $today.content | Where-Object { $_.status -eq 'PENDING' } | Select-Object -First 1
if ($pending) {
  foreach ($ex in $pending.exercises) {
    for ($s = 1; $s -le $ex.targetSets; $s++) {
      $setPath = Join-Path $tmp "set-$s.json"
      Write-Json $setPath @{
        exerciseId = $ex.exerciseId
        setNumber = $s
        loadKg = [decimal]$ex.targetLoadKg
        reps = [int]$ex.targetReps
      }
      try {
        Invoke-Api POST "$base/workout-sessions/$($pending.id)/sets" $setPath $clientToken | Out-Null
      } catch {
        "set warn: $_"
      }
    }
  }
  $fin = Join-Path $tmp 'finish.json'
  Write-Json $fin @{ confirmPartial = $false }
  try {
    Invoke-Api POST "$base/workout-sessions/$($pending.id)/completions" $fin $clientToken | Out-Null
    "Finished today's session $($pending.id)"
  } catch {
    "finish warn: $_"
  }
}

$count = docker exec formai-api-postgres-1 psql -U quedena -d formai_db -tAc "SELECT count(*) FROM tracking.workout_sessions WHERE client_id = '$clientId';"
"Cliente Demo sessions: $count"
"Done. Login: cliente.dev@formai.local / ClienteDev1!"
