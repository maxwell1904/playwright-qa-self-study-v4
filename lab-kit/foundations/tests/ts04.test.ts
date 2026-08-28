import test from 'node:test';
import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';

type LessonModule = typeof import('../reference/ts04.ts');
const selectedTarget = process.env.FOUNDATION_TARGET === 'reference' ? 'reference' : 'work';
const lesson = await import(new URL(`../${selectedTarget}/ts04.ts`, import.meta.url).href) as LessonModule;

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolvePromise: (() => void) | undefined;
  const promise = new Promise<void>(resolve => { resolvePromise = resolve; });
  return { promise, resolve: () => resolvePromise?.() };
}

function pageDouble(gotoResult: ReturnType<typeof deferred>, clickResult: ReturnType<typeof deferred>, calls: unknown[][]): Page {
  const rowheader = { kind: 'rowheader' };
  const link = { click: () => { calls.push(['click']); return clickResult.promise; } };
  const scopedRow = { getByRole: (role: string, options: unknown) => { calls.push(['row.getByRole', role, options]); return link; } };
  const row = { filter: (options: unknown) => { calls.push(['row.filter', options]); return scopedRow; } };
  return {
    goto(url: string) { calls.push(['goto', url]); return gotoResult.promise; },
    getByRole(role: string, options?: unknown) {
      calls.push(['page.getByRole', role, options]);
      return role === 'rowheader' ? rowheader : row;
    },
  } as unknown as Page;
}

test('TS04 helper scopes by exact code and awaits the click Promise', async () => {
  const calls: unknown[][] = [];
  const gotoResult = deferred();
  const clickResult = deferred();
  gotoResult.resolve();
  const page = pageDouble(gotoResult, clickResult, calls);
  const operation = lesson.openOrderByCode(page, 'LD-002');
  await Promise.resolve();
  assert.deepEqual(calls.slice(0, 4), [
    ['page.getByRole', 'rowheader', { name: 'LD-002', exact: true }],
    ['page.getByRole', 'row', undefined],
    ['row.filter', { has: { kind: 'rowheader' } }],
    ['row.getByRole', 'link', { name: 'Chi tiết', exact: true }],
  ]);
  let settled = false;
  void operation.then(() => { settled = true; });
  await Promise.resolve();
  assert.equal(settled, false);
  clickResult.resolve();
  await operation;
});

test('TS04 runner awaits navigation, helper and typed assertion in order', async () => {
  const calls: unknown[][] = [];
  const gotoResult = deferred();
  const clickResult = deferred();
  const assertionResult = deferred();
  const page = pageDouble(gotoResult, clickResult, calls);
  const scenario = { code: 'LD-002', expectedCustomer: 'Trần Thu Hà', expectedStatus: 'PROCESSING' as const };
  const operation = lesson.runOrderScenario(page, scenario, async (_page, received) => {
    calls.push(['assertDetail', received.code, received.expectedCustomer, received.expectedStatus]);
    await assertionResult.promise;
  });
  await Promise.resolve();
  assert.deepEqual(calls, [['goto', '/orders']]);
  gotoResult.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(calls.some(call => call[0] === 'click'), true);
  clickResult.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls.at(-1), ['assertDetail', 'LD-002', 'Trần Thu Hà', 'PROCESSING']);
  assertionResult.resolve();
  await operation;
});
