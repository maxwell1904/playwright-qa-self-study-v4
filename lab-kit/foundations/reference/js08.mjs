export function buildOrderTestPlan(code) {
  if (typeof code !== 'string' || code.trim() === '') throw new Error('code is required');
  const normalizedCode = code.trim();
  return {
    fixture: 'page',
    selection: `row containing exact business-code cell ${normalizedCode}`,
    action: "link role/name 'Chi tiết' inside that row",
    assertion: `visible heading 'Đơn ${normalizedCode}'`,
    awaitedSteps: ['goto', 'click', 'heading visibility']
  };
}

export async function openOrderByCode(page, code) {
  const normalizedCode = code.trim();
  await page.goto('/orders');
  const codeCell = page.getByRole('cell', { name: normalizedCode, exact: true });
  const row = page.getByRole('row').filter({ has: codeCell });
  await row.getByRole('link', { name: 'Chi tiết', exact: true }).click();
  await page.getByRole('heading', {
    name: `Đơn ${normalizedCode}`,
    exact: true
  }).waitFor({ state: 'visible' });
}
