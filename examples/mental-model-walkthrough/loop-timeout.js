// A small scheduling bug — good for a live Mental Model Mode walkthrough.
//
// Each button should log its OWN label a moment after the last, as if the
// clicks were staggered. Run it and watch what actually gets logged.
//
//   node loop-timeout.js
//
// (No spoilers here on purpose — predict the output before you run it.)

const buttons = ["Save", "Edit", "Delete", "Share", "Print"];

for (var i = 0; i < buttons.length; i++) {
  setTimeout(() => {
    console.log(`Fired handler ${i}: ${buttons[i]}`);
  }, i * 200);
}
