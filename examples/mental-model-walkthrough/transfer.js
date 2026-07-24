// The SAME concept in a different shape — this is the "transfer" step.
//
// makeAdders() builds three functions in a loop, then we call them later.
// Predict what the three calls print before running:
//
//   node transfer.js

function makeAdders() {
  const adders = [];
  for (var n = 1; n <= 3; n++) {
    adders.push((x) => x + n);
  }
  return adders;
}

const [add1, add2, add3] = makeAdders();
console.log(add1(10), add2(10), add3(10));
