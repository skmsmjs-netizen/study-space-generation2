import { expect, it } from 'vitest';
import {
  featureEntityForDialog,
  featureEntityForRoute,
  featureIdentityForRoute,
  featureSurfaceAttributes,
} from './observatory-feature-identity';

it.each([
  ['/record/topic-id', 'R21', 'journal'],
  ['/free/new', 'R31', 'document'],
  ['/materials/trash', 'R24', 'control'],
  ['/materials/source-id', 'R23', 'document'],
  ['/recall/scheduled', 'R29', 'practice'],
  ['/memory-test/result/result-id', 'R28', 'practice'],
  ['/statistics', 'R02', 'analysis'],
  ['/canvas', 'R15', 'spatial'],
  ['/board', 'R17', 'board'],
  ['/schedules', 'R03', 'timeline'],
  ['/not-a-screen', 'R41', 'catalogue'],
])(
  'resolves %s without treating a reserved route as an editable document',
  (route, entity, composition) => {
    expect(featureEntityForRoute(route)).toBe(entity);
    expect(featureIdentityForRoute(route)?.composition).toBe(composition);
  },
);

it('distinguishes a chapter catalogue from the topic journal without changing its entity ID', () => {
  const path = '/node/the-same-id';
  expect(featureEntityForRoute(path, 'unit')).toBe('R20');
  expect(featureIdentityForRoute(path, 'unit')?.id).toBe('outline');
  expect(featureIdentityForRoute(path, 'outline')?.composition).toBe('catalogue');
  expect(featureIdentityForRoute(path, 'topic')?.id).toBe('study-record');
});

it('keeps portal identity with the operation, including shared and dynamic dialog titles', () => {
  expect(featureEntityForDialog('목차 추가', 'bulk')).toBe('O04');
  expect(featureEntityForDialog('목차 추가', 'node')).toBe('O03');
  expect(featureEntityForDialog('이차함수 · 전체 화면')).toBe('O14');
  expect(featureEntityForDialog('알 수 없는 새 대화상자')).toBeUndefined();
  expect(featureSurfaceAttributes('U29')['data-feature-identity']).toBe('ink');
  expect(featureSurfaceAttributes('U37')['data-feature-composition']).toBe('control');
});
