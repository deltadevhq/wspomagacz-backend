const { generateRandomWorkout } = require('./workoutGenerator');
const user_id = 1;

(async () => {
  const randomWorkout = await generateRandomWorkout(user_id);  // Await the result of the async function
  console.log(JSON.stringify(randomWorkout, null, 2));  // Log the generated workout object
})();
