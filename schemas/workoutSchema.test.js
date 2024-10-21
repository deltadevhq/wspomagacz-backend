const { describe, test, expect } = require('@jest/globals');
const { baseWorkoutSchema, baseSetsSchema } = require('./workoutSchema');

describe('Workout validation schema', () => {
  //#region ID validation
  describe('ID validation', () => {
    test('ID with negative number should fail', () => {
      const id = -1;

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a positive number');
    });

    test('ID with zero should fail', () => {
      const id = 0;

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a positive number');
    });

    test('ID with decimal number should fail', () => {
      const id = 1.5;

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be an integer');
    });

    test('ID with string should fail', () => {
      const id = '1a';

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a number');
    });

    test('ID with valid number should pass', () => {
      const id = 1;

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).toBeUndefined();
    });

    test('ID with large number should pass', () => {
      const id = Number.MAX_SAFE_INTEGER;

      const { error } = baseWorkoutSchema.id.validate(id);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Related workout ID validation
  describe('Related workout ID validation', () => {
    test('Related workout ID with negative number should fail', () => {
      const relatedWorkoutId = -1;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Related workout ID must be a positive number');
    });

    test('Related workout ID with zero should fail', () => {
      const relatedWorkoutId = 0;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Related workout ID must be a positive number');
    });

    test('Related workout ID with decimal number should fail', () => {
      const relatedWorkoutId = 1.5;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Related workout ID must be an integer');
    });

    test('Related workout ID with string should fail', () => {
      const relatedWorkoutId = '1a';

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Related workout ID must be a number');
    });

    test('Related workout ID with valid number should pass', () => {
      const relatedWorkoutId = 1;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).toBeUndefined();
    });

    test('Related workout ID with large number should pass', () => {
      const relatedWorkoutId = Number.MAX_SAFE_INTEGER;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).toBeUndefined();
    });

    test('Related workout ID with null should pass', () => {
      const relatedWorkoutId = null;

      const { error } = baseWorkoutSchema.related_workout_id.validate(relatedWorkoutId);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region User ID validation
  describe('User ID validation', () => {
    test('User ID with negative number should fail', () => {
      const userId = -1;

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a positive number');
    });

    test('User ID with zero should fail', () => {
      const userId = 0;

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a positive number');
    });

    test('User ID with decimal number should fail', () => {
      const userId = 1.5;

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be an integer');
    });

    test('User ID with string should fail', () => {
      const userId = '1a';

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a number');
    });

    test('User ID with valid number should pass', () => {
      const userId = 1;

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).toBeUndefined();
    });

    test('User ID with large number should pass', () => {
      const userId = Number.MAX_SAFE_INTEGER;

      const { error } = baseWorkoutSchema.user_id.validate(userId);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Name validation
  describe('Name validation', () => {
    test('Name with less than 3 characters should fail', () => {
      const name = 'ab';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Workout name must be at least 3 characters long');
    });

    test('Name with more than 100 characters should fail', () => {
      const name = 'a'.repeat(101);

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Workout name must be at most 100 characters long');
    });

    test('Name with invalid characters should fail', () => {
      const name = 'ab!';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Workout name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
    });

    test('Name with valid characters should pass', () => {
      const name = 'Name';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).toBeUndefined();
    });

    test('Name with valid characters and spaces should pass', () => {
      const name = 'Name Name';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).toBeUndefined();
    });

    test('Name with valid characters and multiple spaces should fail', () => {
      const name = 'Name  Name';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Workout name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
    });

    test('Name with valid characters and numbers should pass', () => {
      const name = 'Name 1';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).toBeUndefined();
    });

    test('Name with valid characters, numbers and spaces should pass', () => {
      const name = 'Name 1 Name';

      const { error } = baseWorkoutSchema.name.validate(name);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Exercises validation
  describe('Exercises array validation', () => {
    test('Exercises with empty array should pass', () => {
      const exercises = [];

      const { error } = baseWorkoutSchema.exercises.validate(exercises);

      expect(error).toBeUndefined();
    });

    test('Exercises with one exercise should pass', () => {
      const exercises = [
        {
          exercise: {
            exercise_id: 1,
            exercise_name: 'Exercise',
            muscles: [
              {
                id: 1,
                name: 'Muscle',
              },
            ],
            equipment: [
              {
                id: 1,
                name: 'Equipment',
              },
            ],
            user_id: null,
            exercise_type: 'standard',
          },
          sets: [
            {
              reps: 10,
              weight: 10,
              order: 0,
            },
          ],
          order: 0,
        },
      ];

      const { error } = baseWorkoutSchema.exercises.validate(exercises);

      expect(error).toBeUndefined();
    });

    test('Exercises with multiple exercises should pass', () => {
      const exercises = [
        {
          exercise: {
            exercise_id: 1,
            exercise_name: 'Exercise',
            muscles: [
              {
                id: 1,
                name: 'Muscle',
              },
            ],
            equipment: [
              {
                id: 1,
                name: 'Equipment',
              },
            ],
            user_id: null,
            exercise_type: 'standard',
          },
          sets: [
            {
              reps: 10,
              weight: 10,
              order: 0,
            },
          ],
          order: 0,
        },
        {
          exercise: {
            exercise_id: 2,
            exercise_name: 'Exercise 2',
            muscles: [
              {
                id: 2,
                name: 'Muscle 2',
              },
            ],
            equipment: [
              {
                id: 2,
                name: 'Equipment 2',
              },
            ],
            user_id: null,
            exercise_type: 'standard',
          },
          sets: [
            {
              reps: 10,
              weight: 10,
              order: 0,
            },
          ],
          order: 1,
        },
      ];

      const { error } = baseWorkoutSchema.exercises.validate(exercises);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Date validation
  describe('Date validation', () => {
    test('Date with invalid format should fail', () => {
      const date = '2021-31-01';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Date with invalid format should fail', () => {
      const date = '2021-01-32';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Date with date before 1900 should fail', () => {
      const date = '1899-12-31';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Date must be after January 1st, 1900');
    });

    test('Date with date after 2100 should fail', () => {
      const date = '2100-01-01';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Date must be a date before January 1st, 2100');
    });

    test('Date with valid date should pass', () => {
      const date = '2021-01-01';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).toBeUndefined();
    });

    test('Date with valid ISO date should pass', () => {
      const date = '2021-01-01T00:00:00.000Z';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).toBeUndefined();
    });

    test('Date with timezone literal should fail', () => {
      const date = '2021-01-01T00:00:00.000 CEST';

      const { error } = baseWorkoutSchema.date.validate(date);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });
  });
  //#endregion

  //#region Started at validation
  describe('Started at date validation', () => {
    test('Started at with invalid format should fail', () => {
      const startedAt = '2021-31-01T00:00:00.000Z';

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Started at with invalid format should fail', () => {
      const startedAt = '2021-01-32T00:00:00.000Z';

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Started at with date before 1900 should fail', () => {
      const startedAt = '1899-12-31T00:00:00.000Z';

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Start date must be after January 1st, 1900');
    });

    test('Started at with date after now should fail', () => {
      const startedAt = new Date(Date.now() + 1000).toISOString();

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Start date must be a date before today');
    });

    test('Started at with valid date should pass', () => {
      const startedAt = '2021-01-01T00:00:00.000Z';

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).toBeUndefined();
    });

    test('Started at with null should pass', () => {
      const startedAt = null;

      const { error } = baseWorkoutSchema.started_at.validate(startedAt);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Finished at validation
  describe('Finished at date validation', () => {
    test('Finished at with invalid format should fail', () => {
      const finishedAt = '2021-31-01T00:00:00.000Z';

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Finished at with invalid format should fail', () => {
      const finishedAt = '2021-01-32T00:00:00.000Z';

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"value" must be in ISO 8601 date format');
    });

    test('Finished at with date before 1900 should fail', () => {
      const finishedAt = '1899-12-31T00:00:00.000Z';

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Finish date must be after January 1st, 1900');
    });

    test('Finished at with date after now should fail', () => {
      const finishedAt = new Date(Date.now() + 1000).toISOString();

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Finish date must be a date before today');
    });

    test('Finished at with valid date should pass', () => {
      const finishedAt = '2021-01-01T00:00:00.000Z';

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).toBeUndefined();
    });

    test('Finished at with null should pass', () => {
      const finishedAt = null;

      const { error } = baseWorkoutSchema.finished_at.validate(finishedAt);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Status validation
  describe('Status validation', () => {
    test('Status with invalid value should fail', () => {
      const status = 'invalid';

      const { error } = baseWorkoutSchema.status.validate(status);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Workout status must be one of completed, in_progress, planned or skipped');
    });

    test('Status with valid value should pass', () => {
      const status = 'planned';

      const { error } = baseWorkoutSchema.status.validate(status);

      expect(error).toBeUndefined();
    });

    test('Status with valid value should pass', () => {
      const status = 'in_progress';

      const { error } = baseWorkoutSchema.status.validate(status);

      expect(error).toBeUndefined();
    });

    test('Status with valid value should pass', () => {
      const status = 'completed';

      const { error } = baseWorkoutSchema.status.validate(status);

      expect(error).toBeUndefined();
    });

    test('Status with valid value should pass', () => {
      const status = 'skipped';

      const { error } = baseWorkoutSchema.status.validate(status);

      expect(error).toBeUndefined();
    });
  });
  //#endregion

  //#region Notes validation
  describe('Notes validation', () => {
    test('Notes with more than 100 characters should fail', () => {
      const notes = 'a'.repeat(101);

      const { error } = baseWorkoutSchema.notes.validate(notes);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Notes must be at most 100 characters long');
    });

    test('Notes with invalid characters should fail', () => {
      const notes = 'ab!';

      const { error } = baseWorkoutSchema.notes.validate(notes);

      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Notes must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
    });

    test('Notes with valid characters should pass', () => {
      const notes = 'Notes';

      const { error } = baseWorkoutSchema.notes.validate(notes);

      expect(error).toBeUndefined();
    });

    test('Notes with valid characters and spaces should pass', () => {
      const notes = 'Notes Notes';

      const { error } = baseWorkoutSchema.notes.validate(notes);

      expect(error).toBeUndefined();
    });

    test('Empty notes should pass', () => {
      const notes = '';

      const { error } = baseWorkoutSchema.notes.validate(notes);

      expect(error).toBeUndefined();
    });
  });
  //#endregion
});
