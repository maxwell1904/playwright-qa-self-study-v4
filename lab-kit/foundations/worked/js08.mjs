const plan = {
  registration: "test('staff opens order LD-002', callback)",
  fixture: 'page',
  selection: "row filtered by business code 'LD-002'",
  action: "link role/name 'Chi tiết' inside that row",
  assertion: "visible heading 'Đơn LD-002'",
  awaitedSteps: ['goto', 'click', 'expect']
};

console.log(plan);
console.log('A locator is a query recipe; nth(1) is not business identity.');
