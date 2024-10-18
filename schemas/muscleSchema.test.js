const { describe, test, expect } = require('@jest/globals');
const { baseMuscleSchema } = require('./muscleSchema');

describe('Muscle validation schema', () => {
    //#region ID validation
    describe('ID validation', () => {
        test('ID with negative number should fail', () => {
            const id = -1;

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('ID with zero should fail', () => {
            const id = 0;

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a positive number');
        });

        test('ID with decimal number should fail', () => {
            const id = 1.5;

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be an integer');
        });

        test('ID with string should fail', () => {
            const id = '1';

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('ID must be a number');
        });

        test('ID with valid number should pass', () => {
            const id = 1;

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).toBeUndefined();
        });

        test('ID with large number should pass', () => {
            const id = Number.MAX_SAFE_INTEGER;

            const { error } = baseMuscleSchema.id.validate(id);

            expect(error).toBeUndefined();
        });
    });
    //#endregion

    //#region Name validation
    describe('Name validation', () => {
        test('Name with less than 3 characters should fail', () => {
            const name = 'ab';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Muscle name must be at least 3 characters long');
        });

        test('Name with more than 100 characters should fail', () => {
            const name = 'a'.repeat(101);

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Muscle name must be at most 100 characters long');
        });

        test('Name with invalid characters should fail', () => {
            const name = 'Muscle1!';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Muscle name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });

        test('Name with valid characters should pass', () => {
            const name = 'Muscle';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).toBeUndefined();
        });

        test('Name with valid characters and space should pass', () => {
            const name = 'Muscle Group';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).toBeUndefined();
        });

        test('Name with valid characters and multiple spaces should fail', () => {
            const name = 'Muscle  Group';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Muscle name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });

        test('Name with valid characters and space at the end should fail', () => {
            const name = 'Muscle ';

            const { error } = baseMuscleSchema.name.validate(name);

            expect(error).not.toBeUndefined();
            expect(error.details[0].message).toBe('Muscle name must contain only letters, numbers, and spaces. You are required to use at least 3 alphanumeric symbols and can only use one space between words.');
        });
    });
    //#endregion
});
