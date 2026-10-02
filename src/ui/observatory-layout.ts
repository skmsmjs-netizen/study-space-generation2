import selections from './observatory-layouts.json';

export function layoutSurfaceAttributes(entityId?: string) {
  const layout = entityId ? selections.entities[entityId as keyof typeof selections.entities] : undefined;
  return {
    'data-layout-profile': layout?.profile,
    'data-layout-pattern': layout?.primary,
    'data-layout-narrow': layout?.narrow,
    'data-layout-wrapper': layout?.wrapper || undefined,
  };
}
