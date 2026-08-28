const roles = ['ANONYMOUS', 'STAFF', 'MANAGER'];

for (const role of roles) {
  const authenticated = role !== 'ANONYMOUS';
  const managerAllowed = role === 'MANAGER';
  let outcome;

  if (managerAllowed) {
    outcome = 200;
  } else if (authenticated) {
    outcome = 403;
  } else {
    outcome = 302;
  }

  console.log(`${role}: ${outcome}`);
}

const status = 'READY_FOR_PICKUP';
const remaining = 0;
const hasOpenIssue = false;
const pickupAllowed = status === 'READY_FOR_PICKUP'
  && remaining === 0
  && hasOpenIssue === false;
console.log('Pickup allowed:', pickupAllowed);
