const roles = ['ANONYMOUS', 'STAFF', 'MANAGER'];

for (const role of roles) {
  const authenticated = role === 'STAFF' || role === 'MANAGER';
  const managerRouteAllowed = role === 'MANAGER';

  if (managerRouteAllowed) {
    console.log(role + ': 200');
  } else if (authenticated) {
    console.log(role + ': 403');
  } else {
    console.log(role + ': 302 login');
  }
}

const statuses = [
  'RECEIVED',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'CANCELLED',
  'UNKNOWN'
];

for (const status of statuses) {
  let action;

  if (status === 'RECEIVED') {
    action = 'start or cancel';
  } else if (status === 'PROCESSING') {
    action = 'mark ready';
  } else if (status === 'READY_FOR_PICKUP') {
    action = 'complete when guards pass';
  } else if (status === 'COMPLETED' || status === 'CANCELLED') {
    action = 'terminal';
  } else {
    action = 'ERROR unknown status';
  }

  console.log(status + ': ' + action);
}
