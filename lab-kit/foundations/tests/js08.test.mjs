import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const { buildOrderTestPlan, openOrderByCode } = await import(lessonUrl('JS08'));

function deferred() {
  let resolve;
  const promise = new Promise(resolvePromise => { resolve = resolvePromise; });
  return { promise, resolve };
}

function fakePage(clickResult, headingResult, calls) {
  const cell = { kind: 'business-code-cell' };
  const link = {
    click() {
      calls.push(['click']);
      return clickResult.promise;
    }
  };
  const filteredRow = {
    getByRole(role, options) {
      calls.push(['row.getByRole', role, options]);
      return link;
    }
  };
  const rowRecipe = {
    filter(options) {
      calls.push(['row.filter', options]);
      return filteredRow;
    },
    nth(index) {
      calls.push(['row.nth', index]);
      return filteredRow;
    }
  };
  const heading = {
    waitFor(options) {
      calls.push(['heading.waitFor', options]);
      return headingResult.promise;
    }
  };

  return {
    goto(url) {
      calls.push(['goto', url]);
      return Promise.resolve();
    },
    getByRole(role, options) {
      calls.push(['page.getByRole', role, options]);
      if (role === 'cell') return cell;
      if (role === 'row') return rowRecipe;
      if (role === 'heading') return heading;
      throw new Error(`Unexpected role: ${role}`);
    },
    getByText(text) {
      calls.push(['page.getByText', text]);
      return heading;
    }
  };
}

test('JS08 plans a semantic, business-identity-based Playwright test', () => {
  assert.deepEqual(buildOrderTestPlan('LD-002'), {
    fixture: 'page',
    selection: 'row containing exact business-code cell LD-002',
    action: "link role/name 'Chi tiết' inside that row",
    assertion: "visible heading 'Đơn LD-002'",
    awaitedSteps: ['goto', 'click', 'heading visibility']
  });
});

test('JS08 scopes the action to an exact business-code cell and semantic link', async () => {
  const clickResult = deferred();
  const headingResult = deferred();
  const calls = [];
  const page = fakePage(clickResult, headingResult, calls);
  const operation = openOrderByCode(page, 'LD-002');

  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls.slice(0, 5), [
    ['goto', '/orders'],
    ['page.getByRole', 'cell', { name: 'LD-002', exact: true }],
    ['page.getByRole', 'row', undefined],
    ['row.filter', { has: { kind: 'business-code-cell' } }],
    ['row.getByRole', 'link', { name: 'Chi tiết', exact: true }]
  ]);

  assert.equal(calls.some(call => call[0] === 'heading.waitFor'), false);
  clickResult.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(calls.at(-2), [
    'page.getByRole', 'heading', { name: 'Đơn LD-002', exact: true }
  ]);
  assert.deepEqual(calls.at(-1), ['heading.waitFor', { state: 'visible' }]);

  let settled = false;
  void operation.then(() => { settled = true; });
  await Promise.resolve();
  assert.equal(settled, false);
  headingResult.resolve();
  await operation;
});
