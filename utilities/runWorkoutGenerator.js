const { generateRandomWorkout } = require('./workoutGenerator');

(async () => {
  const randomWorkout = await generateRandomWorkout();  // Await the result of the async function
  console.log(JSON.stringify(randomWorkout, null, 2));  // Log the generated workout object
})();
