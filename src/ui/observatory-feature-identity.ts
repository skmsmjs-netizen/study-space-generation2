import contract from '../../docs/observatory-feature-identities.json';
import { layoutSurfaceAttributes } from './observatory-layout';

export type FeatureComposition =
  | 'journal'
  | 'catalogue'
  | 'document'
  | 'practice'
  | 'instrument'
  | 'analysis'
  | 'spatial'
  | 'board'
  | 'timeline'
  | 'control';

export interface FeatureIdentity {
  id: string;
  label: string;
  metaphor: string;
  place: string;
  purpose: string;
  guidance: string;
  composition: FeatureComposition;
  primaryAction: string;
  entityIds: string[];
}
interface RouteBinding {
  pattern: string;
  entityId: string;
  nodeRole?: string;
  identityId?: string;
}
interface IdentityContract {
  identities: FeatureIdentity[];
  routeBindings: RouteBinding[];
  dialogBindings: { title?: string; titleSuffix?: string; dialogMode?: string; entityId: string }[];
}

// The authored contract is the source; the UI does not maintain a second
// vocabulary or infer study meaning from a color, route visit or composition.
const definitions = contract as IdentityContract;
export const featureIdentities = definitions.identities;
const byEntity = new Map(
  featureIdentities.flatMap((identity) => identity.entityIds.map((id) => [id, identity] as const)),
);
const routes = [...definitions.routeBindings].sort((a, b) => {
  const dynamicA = a.pattern.split('/').filter((part) => part.startsWith(':')).length;
  const dynamicB = b.pattern.split('/').filter((part) => part.startsWith(':')).length;
  return (
    dynamicA - dynamicB ||
    Number(Boolean(b.nodeRole)) - Number(Boolean(a.nodeRole)) ||
    b.pattern.length - a.pattern.length
  );
});

export function featureIdentityForEntity(entityId: string) {
  return byEntity.get(entityId);
}

export function featureEntityForRoute(route: string, nodeRole?: string) {
  return routeBinding(route, nodeRole)?.entityId ?? 'R41';
}

function routeBinding(route: string, nodeRole?: string) {
  const parts = route.split('/');
  return routes.find((binding) => {
    if (binding.nodeRole && binding.nodeRole !== nodeRole) return false;
    const expected = binding.pattern.split('/');
    return (
      expected.length === parts.length &&
      expected.every((part, index) =>
        part.startsWith(':') ? Boolean(parts[index]) : part === parts[index],
      )
    );
  });
}

export function featureIdentityForRoute(route: string, nodeRole?: string) {
  const binding = routeBinding(route, nodeRole);
  if (binding?.identityId)
    return featureIdentities.find((identity) => identity.id === binding.identityId);
  return featureIdentityForEntity(featureEntityForRoute(route, nodeRole));
}

export function featureEntityForDialog(title: string, dialogMode?: string) {
  return definitions.dialogBindings.find(
    (binding) =>
      (!dialogMode || !binding.dialogMode || binding.dialogMode === dialogMode) &&
      (binding.title === title ||
        Boolean(binding.titleSuffix && title.endsWith(binding.titleSuffix))),
  )?.entityId;
}

export function featureSurfaceAttributes(
  entityId: string | undefined,
  givenIdentity?: FeatureIdentity,
) {
  const identity = givenIdentity ?? (entityId ? featureIdentityForEntity(entityId) : undefined);
  return {
    ...layoutSurfaceAttributes(entityId),
    'data-feature-entity': entityId,
    'data-feature-identity': identity?.id,
    'data-feature-composition': identity?.composition,
  };
}
