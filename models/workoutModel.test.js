const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { createWorkout, deleteWorkout, updateWorkout, startWorkout, finishWorkout } = require('./workoutModel');
const { generateRandomWorkout } = require('../utilities/workoutGenerator');

/**
 * Function to create generate and create a test workout
 * @returns {Promise<void>} - Promise object that represents the workout that was created
 */
const createTestWorkout = async () => {
  const workout = await generateRandomWorkout(4);
  workout.exercises = JSON.stringify(workout.exercises);

  const { related_workout_id, user_id, exercises, date, name, notes } = workout;

  return await createWorkout(related_workout_id, user_id, name, exercises, date, notes);
};

describe('Workout Creation', () => {
  let workout = undefined;

  beforeEach(async () => {
    expect(workout).toBeUndefined();

    workout = await createTestWorkout();
    workout.exercises = JSON.stringify(workout.exercises);
  });

  afterEach(async () => {
    await deleteWorkout(workout.id);

    // Reset the workout after deleting it to make sure it's not used in the next test
    workout = undefined;
  });

  // TODO: Separate past and future workouts creation tests
  test('successfully creates a workout', async () => {
    // 2 workouts are created when using this test

    const newWorkout = await createTestWorkout();
    expect(newWorkout).toHaveProperty('id');

    const date = new Date(newWorkout.date);
    console.log('Date:', date.toLocaleDateString('sv-SE'));

    // If the date is in the past the status should be 'skipped'
    if (date < new Date().setHours(0, 0, 0, 0)) {
      expect(newWorkout.status).toBe('skipped');
    }

    // If the date is today or in the future the status should be 'planned'
    if (date >= new Date().setHours(0, 0, 0, 0)) {
      expect(newWorkout.status).toBe('planned');
    }
  });

  test('fails to create a workout with a date that already has a workout', async () => {
    // Try to create a workout with the same date as the workout created in the hook
    await expect(createWorkout(null, workout.user_id, 'Test workout', workout.exercises, workout.date, 'Test notes')).rejects.toThrowError();
  });

  test('successfully updates a workout', async () => {
    const { exercises, date, notes } = workout;
    expect(workout.name).not.toBe('Updated workout');

    const updatedWorkout = await updateWorkout(workout.id, 'Updated workout', exercises, date, notes);
    expect(updatedWorkout.name).toBe('Updated workout');
  });

  test('fails to update a workout date to a date that already has a workout', async () => {
    // Create a workout to be used for the test
    const testWorkout = await createTestWorkout();
    const { id, name, notes } = testWorkout;
    const exercises = JSON.stringify(testWorkout.exercises);

    // Try to update the workout to the same date as the workout created in the hook
    await expect(updateWorkout(id, name, exercises, workout.date, notes)).rejects.toThrowError();
  });

  test('handles starting a workout', async () => {
    expect(workout.started_at).toBeNull();

    if (workout.date === new Date().toLocaleDateString('sv-SE')) {
      expect(workout.status).toBe('planned');

      const startedWorkout = await startWorkout(workout.id);

      expect(startedWorkout.started_at).not.toBeNull();
      expect(startedWorkout.status).toBe('in_progress');
    } else {
      // If the date is in the past the workout should be skipped, therefore it should not be possible to start it
      if (workout.date < new Date().setHours(0, 0, 0, 0)) {
        expect(workout.status).toBe('skipped');
      }

      expect(workout.status).toBe('planned');

      // If the date is not today it should not be possible to start the workout and an error should be thrown
      await expect(startWorkout(workout.id)).rejects.toThrowError();
    }
  });

  test('handles finishing a workout', async () => {
    expect(workout.finished_at).toBeNull();

    // Try prematurely finishing a workout, it should always result in an error
    await expect(finishWorkout(workout.id)).rejects.toThrowError();

    // Start the workout, the steps are thoroughly tested in the 'handles starting a workout' test
    const startedWorkout = await startWorkout(workout.id);
    expect(startedWorkout.started_at).not.toBeNull();
    expect(startedWorkout.status).toBe('in_progress');

    // Finish the workout
    const finishedWorkout = await finishWorkout(workout.id);
    expect(finishedWorkout.finished_at).not.toBeNull();
    expect(finishedWorkout.status).toBe('completed');
  });
});
