const { describe, test, expect } = require('@jest/globals');
const { baseExerciseSchema } = require('./exerciseSchema');

describe('Exercise validation schema', () => {
    //#region ID validation
    describe('ID validation', () => {
        test('ID with negative number should fail', () => {
            const id = -1;

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('ID with zero should fail', () => {
            const id = 0;

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('ID with decimal number should fail', () => {
            const id = 1.5;

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be an integer');
        });

        test('ID with string should fail', () => {
            const id = '1';

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a number');
        });

        test('ID with valid number should pass', () => {
            const id = 1;

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).toBeUndefined();
        });

        test('ID with large number should pass', () => {
            const id = Number.MAX_SAFE_INTEGER;

            const { error } = baseExerciseSchema.exercise_id.validate(id);

            expect(error).toBeUndefined();
        });
    });
    //#endregion

    //#region Name validation
    describe('Name validation', () => {
        test('Name with less than 3 characters should fail', () => {
            const name = 'Tr';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise name must be at least 3 characters long');
        });

        test('Name with more than 100 characters should fail', () => {
            const name = 'T'.repeat(101);

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise name must be at most 100 characters long');
        });

        test('Name with special characters should fail', () => {
            const name = 'Treadmill@123';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });

        test('Name with multiple spaces should fail', () => {
            const name = 'Treadmill  Running';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });

        test('Name with space at the end should fail', () => {
            const name = 'Treadmill ';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });

        test('Valid name should pass', () => {
            const name = 'Treadmill';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).toBeUndefined();
        });

        test('Valid name with space should pass', () => {
            const name = 'Treadmill Running';

            const { error } = baseExerciseSchema.exercise_name.validate(name);

            expect(error).toBeUndefined();
        });
    });
    //#endregion

    //#region Equipment validation
    describe('Equipment validation', () => {
        test('Equipment with empty array should pass', () => {
            const equipment = [];

            const { error } = baseExerciseSchema.equipment.validate(equipment);

            expect(error).toBeUndefined();
        });

        test('Equipment with invalid object should fail', () => {
            const equipment = [{}];

            const { error } = baseExerciseSchema.equipment.validate(equipment);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID is required');
        });

        test('Equipment with valid object should pass', () => {
            const equipment = [{ id: 1, name: 'Treadmill' }];

            const { error } = baseExerciseSchema.equipment.validate(equipment);

            expect(error).toBeUndefined();
        });

        test('Equipment with multiple valid objects should pass', () => {
            const equipment = [{ id: 1, name: 'Treadmill' }, { id: 2, name: 'Dumbbell' }];

            const { error } = baseExerciseSchema.equipment.validate(equipment);

            expect(error).toBeUndefined();
        });
        //#endregion

        //#region Muscles validation
        test('Muscles with empty array should pass', () => {
            const muscles = [];

            const { error } = baseExerciseSchema.muscles.validate(muscles);

            expect(error).toBeUndefined();
        });

        test('Muscles with invalid object should fail', () => {
            const muscles = [{}];

            const { error } = baseExerciseSchema.muscles.validate(muscles);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID is required');
        });

        test('Muscles with valid object should pass', () => {
            const muscles = [{ id: 1, name: 'Biceps' }];

            const { error } = baseExerciseSchema.muscles.validate(muscles);

            expect(error).toBeUndefined();
        });

        test('Muscles with multiple valid objects should pass', () => {
            const muscles = [{ id: 1, name: 'Biceps' }, { id: 2, name: 'Triceps' }];

            const { error } = baseExerciseSchema.muscles.validate(muscles);

            expect(error).toBeUndefined();
        });
    });
    //#endregion

    //#region Exercise type validation
    describe('Exercise type validation', () => {
        test('Exercise type with invalid value should fail', () => {
            const exercise_type = 'invalid';

            const { error } = baseExerciseSchema.exercise_type.validate(exercise_type);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Exercise type must be one of all, custom or standard');
        });

        test('Exercise type with valid value should pass', () => {
            const exercise_type = 'custom';

            const { error } = baseExerciseSchema.exercise_type.validate(exercise_type);

            expect(error).toBeUndefined();
        });

        test('Exercise type with valid value should pass', () => {
            const exercise_type = 'standard';

            const { error } = baseExerciseSchema.exercise_type.validate(exercise_type);

            expect(error).toBeUndefined();
        });
    });
    //#endregion

    //#region User ID validation
    describe('User ID validation', () => {
        test('User ID with negative number should fail', () => {
            const user_id = -1;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('User ID with zero should fail', () => {
            const user_id = 0;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('User ID with decimal number should fail', () => {
            const user_id = 1.5;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be an integer');
        });

        test('User ID with string should fail', () => {
            const user_id = '1';

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a number');
        });

        test('User ID with valid number should pass', () => {
            const user_id = 1;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).toBeUndefined();
        });

        test('User ID with large number should pass', () => {
            const user_id = Number.MAX_SAFE_INTEGER;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).toBeUndefined();
        });

        test('User ID with null should pass', () => {
            const user_id = null;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).toBeUndefined();
        });

        test('User ID with undefined should pass', () => {
            const user_id = undefined;

            const { error } = baseExerciseSchema.user_id.validate(user_id);

            expect(error).toBeUndefined();
        });
    });
    //#endregion
});
