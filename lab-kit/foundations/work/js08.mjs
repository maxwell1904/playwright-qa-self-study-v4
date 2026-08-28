export function buildOrderTestPlan(code) {
  // TODO JS08: plan with business identity, semantic locator and every awaited step.
  return {
    fixture: 'page',
    selection: 'second row',
    action: 'click text',
    assertion: `text ${code}`,
    awaitedSteps: ['goto']
  };
}

export async function openOrderByCode(page, code) {
  // TODO JS08: await navigation, semantic selection, click and assertion readiness.
  page.goto('/orders');
  page.getByRole('row').nth(1).getByRole('link', { name: 'Chi tiết' }).click();
  page.getByText(`Đơn ${code}`).waitFor();
}
