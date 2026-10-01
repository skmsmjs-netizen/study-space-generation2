import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { Controls } from '@xyflow/react';

/** React Flow's Controls exposes a label but does not forward a role prop.
 * Name its actual native button group after mounting without replacing controls,
 * layout, zoom behavior or the library's keyboard handlers.
 */
export function FlowControls(props: ComponentProps<typeof Controls>) {
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    host.current?.querySelector('.react-flow__controls')?.setAttribute('role', 'group');
  }, []);
  return <div ref={host}><Controls {...props} /></div>;
}
