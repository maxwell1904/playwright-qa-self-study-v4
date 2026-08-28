function canCompletePickup(status, remaining, hasOpenIssue) {
  return status === 'READY_FOR_PICKUP' && remaining === 0 && hasOpenIssue === false;
}

function runCase(label, callback) {
  console.log(`${label}: ${callback()}`);
}

runCase('happy path', () => canCompletePickup('READY_FOR_PICKUP', 0, false));
runCase('unpaid', () => canCompletePickup('READY_FOR_PICKUP', 1, false));
console.log('runCase owns callback timing; callback owns the decision.');
