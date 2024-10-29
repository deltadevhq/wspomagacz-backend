const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const {
  createWorkout,
  deleteWorkout,
  updateWorkout,
  startWorkout,
  finishWorkout,
  getWorkoutByDate, stopWorkout,
} = require('./workoutModel');

const testWorkout = {
  user_id: 1,
  name: 'Test workout',
  exercises: [
    {
      exercise: {
        id: 1,
        name: 'Test exercise',
        muscles: [
          {
            id: 1,
            name: 'Test muscle',
          },
        ],
        equipment: [
          {
            id: 1,
            name: 'Test equipment',
          },
        ],
      },
      sets: [
        {
          reps: 10,
          weight: 20,
          order: 0,
        },
      ],
      order: 0,
    },
  ],
  date: new Date().toLocaleDateString('sv-SE'),
  notes: 'Test notes',
};

const updatedExercises = [
  {
    exercise: {
      id: 1,
      name: 'Test exercise',
      muscles: [
        {
          id: 1,
          name: 'Test muscle',
        },
      ],
      equipment: [
        {
          id: 1,
          name: 'Test equipment',
        },
      ],
    },
    sets: [
      {
        reps: 10,
        weight: 20,
        order: 0,
      },
    ],
    order: 0,
  },
  {
    exercise: {
      id: 2,
      name: 'Test exercise 2',
      muscles: [
        {
          id: 2,
          name: 'Test muscle 2',
        },
      ],
      equipment: [
        {
          id: 2,
          name: 'Test equipment 2',
        },
      ],
    },
    sets: [
      {
        reps: 10,
        weight: 20,
        order: 0,
      },
    ],
    order: 0,
  },
];

/**
 * Function to create generate and create a test workout
 * @param {string | undefined} date - The date of the workout
 * @returns {Promise<void>} - Promise object that represents the workout that was created
 */
const createTestWorkout = async (date = undefined) =>
  await createWorkout(testWorkout.related_workout_id, testWorkout.user_id, testWorkout.name, JSON.stringify(testWorkout.exercises), date || testWorkout.date, testWorkout.notes);

describe('Workout Model', () => {
  describe('Creating workout', () => {

    it('creates a workout with current date', async () => {
      // Make sure the workout doesn't exist before creating it
      await getWorkoutByDate(1, testWorkout.date).then(async (workout) => await workout && deleteWorkout(workout.id));

      // Create the workout
      const { id, status } = await createTestWorkout();

      // Check that the workout was created
      expect(id).not.toBeNull();
      expect(status).toBe('planned');
    });

    it('creates a workout with date in the future', async () => {
      // Set the date to tomorrow
      const date = new Date(new Date().setHours(0, 0, 0, 0));
      date.setDate(date.getDate() + 1);

      // Make sure the workout doesn't exist before creating it
      await getWorkoutByDate(1, date.toLocaleDateString('sv-SE')).then(async (workout) => await workout && deleteWorkout(workout.id));

      // Create the workout
      const { id, status } = await createTestWorkout(date.toLocaleDateString('sv-SE'));

      // Check that the workout was created
      expect(id).not.toBeNull();
      expect(status).toBe('planned');
    });

    it('fails to create a workout with date in the past', async () => {
      // Try to create a workout with a date in the past
      await expect(createTestWorkout('2020-01-01')).rejects.toThrowError();
    });

    it('fails to create a workout with a date that already has a workout', async () => {
      // Make sure the workout doesn't exist before creating it
      await getWorkoutByDate(1, testWorkout.date).then(async (workout) => await workout && deleteWorkout(workout.id));

      // Create a workout to be used for the test
      const createdWorkout = await createTestWorkout();
      const { id, status, related_workout_id, user_id, name, date, notes } = createdWorkout;
      let { exercises } = createdWorkout;
      exercises = JSON.stringify(exercises);

      // Check that the workout was created
      expect(id).not.toBeNull();
      expect(status).toBe('planned');

      // Try to create a workout with the same date as the workout created previously
      await expect(createWorkout(related_workout_id, user_id, name, exercises, date, notes)).rejects.toThrowError();
    });
  });

  describe('Editing workout', () => {
    let workout = undefined;

    beforeEach(async () => {
      expect(workout).toBeUndefined();

      //Make sure the workout doesn't exist before creating it
      await getWorkoutByDate(1, testWorkout.date).then(async (workout) => await workout && deleteWorkout(workout.id));

      // Create the workout
      workout = await createTestWorkout();
      workout.exercises = JSON.stringify(workout.exercises);
    });

    afterEach(async () => {
      // Delete the workout after the test
      await deleteWorkout(workout.id);

      // Reset the workout after deleting it to make sure it's not used in the next test
      workout = undefined;
    });

    it('updates workout\'s name', async () => {
      const { id, exercises, date, notes } = workout;
      expect(workout.name).not.toBe('Updated workout');

      // Update the workout name
      const updatedWorkout = await updateWorkout(id, 'Updated workout', exercises, date, notes);
      expect(updatedWorkout.name).toBe('Updated workout');
    });

    it('updates workout\'s exercises', async () => {
      const { id, name, date, notes } = workout;
      expect(workout.exercises).not.toStrictEqual(updatedExercises);

      // Update the workout name
      const updatedWorkout = await updateWorkout(id, name, JSON.stringify(updatedExercises), date, notes);
      expect(updatedWorkout.exercises).toStrictEqual(updatedExercises);
    });

    it('updates workout\'s date', async () => {
      const { id, exercises, name, notes } = workout;
      const newDate = new Date(new Date().setHours(0, 0, 0, 0));
      newDate.setDate(newDate.getDate() + 2);

      // Update the workout date
      const updatedWorkout = await updateWorkout(id, name, exercises, newDate.toLocaleDateString('sv-SE'), notes);
      expect(new Date(updatedWorkout.date).toLocaleDateString('sv-SE')).toBe(newDate.toLocaleDateString('sv-SE'));
    });

    it('fails to update a workout date to a date that already has a workout', async () => {
      // Create a workout to be used for the test
      const { id, date } = await createTestWorkout('2024-01-01');

      // Check that the workout was created
      expect(id).not.toBeNull();

      // Try to update the workout to a date that already has a workout
      await expect(updateWorkout(workout.id, workout.name, workout.exercises, date, workout.notes)).rejects.toThrowError();

      // Delete the workout after the test
      await deleteWorkout(id);
    });

    describe('Changing workout status', () => {
      it('starts a workout', async () => {
        expect(workout.status).toBe('planned');

        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');
      });

      it('fails to start a workout that is skipped', async () => {
        expect(workout.status).toBe('planned');

        // Skip the workout
        const skippedWorkout = await updateWorkout(workout.id, workout.name, workout.exercises, '2024-01-01', workout.notes);
        expect(skippedWorkout.status).toBe('skipped');

        // Try to start the workout
        await expect(startWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to start a workout that is in progress', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Try to start the workout again
        await expect(startWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to start a workout that is finished', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Finish the workout
        const finishedWorkout = await finishWorkout(workout.id);
        expect(finishedWorkout.status).toBe('completed');

        // Try to start the workout again
        await expect(startWorkout(workout.id)).rejects.toThrowError();
      });

      it('stops a workout', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Finish the workout
        const stoppedWorkout = await stopWorkout(workout.id);
        expect(stoppedWorkout.status).toBe('planned');
      });

      it('fails to stop a workout that is planned', async () => {
        expect(workout.status).toBe('planned');

        // Try to stop the workout without starting it
        await expect(stopWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to stop a workout that is skipped', async () => {
        expect(workout.status).toBe('planned');

        // Skip the workout
        const skippedWorkout = await updateWorkout(workout.id, workout.name, workout.exercises, '2024-01-01', workout.notes);
        expect(skippedWorkout.status).toBe('skipped');

        // Try to stop the workout
        await expect(stopWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to stop a workout that is finished', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Finish the workout
        const finishedWorkout = await finishWorkout(workout.id);
        expect(finishedWorkout.status).toBe('completed');

        // Try to stop the workout
        await expect(stopWorkout(workout.id)).rejects.toThrowError();
      });

      it('finishes a workout', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Finish the workout
        const finishedWorkout = await finishWorkout(workout.id);
        expect(finishedWorkout.status).toBe('completed');
      });

      it('fails to finish a workout that is planned', async () => {
        expect(workout.status).toBe('planned');

        // Try to finish the workout without starting it
        await expect(finishWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to finish a workout that is skipped', async () => {
        expect(workout.status).toBe('planned');

        // Skip the workout
        const skippedWorkout = await updateWorkout(workout.id, workout.name, workout.exercises, '2024-01-01', workout.notes);
        expect(skippedWorkout.status).toBe('skipped');

        // Try to finish the workout
        await expect(finishWorkout(workout.id)).rejects.toThrowError();
      });

      it('fails to finish a workout that is finished', async () => {
        expect(workout.status).toBe('planned');

        // Start the workout
        const startedWorkout = await startWorkout(workout.id);
        expect(startedWorkout.status).toBe('in_progress');

        // Finish the workout
        const finishedWorkout = await finishWorkout(workout.id);
        expect(finishedWorkout.status).toBe('completed');

        // Try to finish the workout again
        await expect(finishWorkout(workout.id)).rejects.toThrowError();
      });
    });
  });
});
