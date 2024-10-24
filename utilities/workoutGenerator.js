const exerciseModel = require('../models/exerciseModel');
const user_id = 4;

// List of random notes
const randomNotes = [
  'Great workout, feeling stronger!',
  'Tough session, but I pushed through!',
  'Need to work on form for a few exercises.',
  'Felt amazing today, energy was high!',
  'Focused more on endurance this time.',
];

// Random number generator
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random workout
const generateRandomWorkout = async (user_id) => {
  let availableExercises = await exerciseModel.getExercises(user_id, 'all');
  const workout_name = ['Legs day', 'Arms day', 'Back day', 'Chest day', 'Push day', 'Pull day'][generateRandomNumber(0, 5)];

  const exerciseCount = generateRandomNumber(3, 6);  // Random number of exercises (3-6)
  const exercises = [];

  for (let i = 0; i < exerciseCount; i++) {
    const randomIndex = generateRandomNumber(0, availableExercises.length - 1);
    const randomExercise = availableExercises[randomIndex];

    const setsCount = generateRandomNumber(3, 5);  // Random number of sets (3-5)
    const sets = [];

    for (let j = 0; j < setsCount; j++) {
      sets.push({
        reps: generateRandomNumber(5, 15),  // Random reps (5-15)
        weight: generateRandomNumber(30, 100),  // Random weight (30-100 kg)
        order: j + 1
      });
    }

    exercises.push({
      exercise: randomExercise,
      sets: sets,
      order: i + 1
    });

    // Remove the chosen exercise from availableExercises
    availableExercises.splice(randomIndex, 1);
  }

  // Random dates and status
  const currentDate = new Date();
  const date = new Date(currentDate.setDate(currentDate.getDate() - generateRandomNumber(1, 30))).toISOString(); // Workout date in the past 30 days

  // Select a random note from the predefined list
  const note = randomNotes[generateRandomNumber(0, randomNotes.length - 1)];

  // Random workout object
  const workout = {
    related_workout_id: null,
    user_id: user_id,
    name: workout_name,
    exercises: exercises,
    date: date,
    notes: note
  };

  return workout;
};

module.exports = { generateRandomWorkout };
