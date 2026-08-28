const roles = ['ANONYMOUS', 'STAFF', 'MANAGER'];

for (const role of roles) {
  // TODO: derive both decisions from role; do not branch by array index.
  const authenticated = false;
  const managerRouteAllowed = false;

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
  // TODO: replace this placeholder with an exhaustive if/else-if/else chain.
  let action = 'TODO';

  console.log(status + ': ' + action);
}
