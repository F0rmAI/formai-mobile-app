/**
 * Pull-to-refresh control for tab screen layouts.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { RefreshControl, ScrollView } from 'react-native';
import { TabScreenLayout } from '@/components/layout';

test('adds a refresh control only when the tab supplies a refresh action', async () => {
  const onRefresh = jest.fn();
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <TabScreenLayout headerSubtitle="Hoy" title="Hoy">
        Content
      </TabScreenLayout>,
    );
  });
  expect(renderer.root.findByType(ScrollView).props.refreshControl).toBeUndefined();
  await ReactTestRenderer.act(async () => {
    renderer.update(
      <TabScreenLayout
        headerSubtitle="Hoy"
        title="Hoy"
        refreshing
        onRefresh={onRefresh}
      >
        Content
      </TabScreenLayout>,
    );
  });
  const control = renderer.root.findByType(ScrollView).props.refreshControl;
  expect(control.type).toBe(RefreshControl);
  expect(control.props.refreshing).toBe(true);
  control.props.onRefresh();
  expect(onRefresh).toHaveBeenCalledTimes(1);
  await ReactTestRenderer.act(async () => renderer.unmount());
});
