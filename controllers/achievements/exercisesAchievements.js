const experienceModel = require('../../models/experienceModel');

// TODO: MOVE VARIABLE TO CONFIG
const DEFAULT_BODY_WEIGHT = 40;

/**
 * Calculates exercises progress for a user.
 *
 * @param {Array} exercises - An array of exercise objects containing details about the exercises performed.
 * @param {Array} user_weights - An array of the user's weights in order, with the latest weight at the end.
 * @param {number} user_id - The ID of the user for whom to calculate the exercises progress.
 * @returns {Promise<Array>} - A promise resolving to an array of exercise progress objects with the user's personal best and total weight and reps for each exercise.
 */
const calculateExercisesProgress = async (exercises, user_weights, user_id) => {
  const bodyweight = user_weights ? user_weights[user_weights.length - 1] : DEFAULT_BODY_WEIGHT;
  let exercises_progress = [];
  let workout_total_weight = 0;

  for (const exercise_object of exercises) {
    const { exercise, sets } = exercise_object;
    const { exercise_id, exercise_type, equipment } = exercise;

    if (exercise_type === 'custom') break;

    const { personal_best: exercise_personal_best_object } = await experienceModel.checkPersonalBestForExercise(exercise_id, 'standard', user_id);
    const { weight: personal_best } = exercise_personal_best_object;
    let total_weight = 0;
    let total_reps = 0;

    for (const set of sets) {
      if (equipment.length > 0) total_weight += set.reps * set.weight;
      else total_weight += set.reps * bodyweight;
      total_reps += set.reps;
    }

    workout_total_weight += total_weight;

    const exercise_progress_object = {
      exercise_id,
      personal_best,
      total_weight,
      total_reps
    };

    exercises_progress.push(exercise_progress_object);
  }

  return { exercises_progress, workout_total_weight };
}

/**
 * Calculates user progress for achievements.
 *
 * @param {Array} exercises_progress - Exercises progress including personal bests and total weight and reps.
 * @param {Array} user_achievements - User achievements including current values and achievement IDs.
 * @param {Array} all_achievements - All achievements with their target values and types.
 * @param {number} user_id - User ID.
 * @returns {Promise<Array>} - A promise resolving to an array of achievement progress objects.
 */
const calculateExercisesAchievementsProgress = async (exercises_progress, user_achievements, all_achievements, user_id) => {
  let achievements_progress = [];

  const exercises_progress_ids = exercises_progress.map(exercise => exercise.exercise_id);
  const achievements = all_achievements.filter(achievement => exercises_progress_ids.includes(achievement.exercise_id));

  for (const achievement of achievements) {
    const { id: achievement_id, exercise_id, type, min_value, target_value, xp: exp } = achievement;

    const user_achievement = user_achievements.find(user_achievement => user_achievement.achievement_id === achievement_id);
    if (user_achievement?.achieved) {
      continue;
    }

    let current_value = user_achievement?.current_value || 0;

    const exercise_progress = exercises_progress.find(exercise => exercise.exercise_id === exercise_id);

    switch (type) {
      case 'exercise_weight':
        current_value += exercise_progress.total_weight;
        break;
      case 'exercise_reps':
        current_value += exercise_progress.total_reps;
        break;
      case 'exercise_pb':
        current_value = exercise_progress.personal_best;
        break;
      default:
        break;
    }

    const new_value = Math.min(current_value, target_value);

    if (new_value <= min_value) {
      continue;
    }
    
    const achievement_progress = {
      achievement,
      user_id,
      current_value: new_value,
      achieved: new_value >= target_value,
      exp,
    }

    achievements_progress.push(achievement_progress);
  }

  return achievements_progress;
}

module.exports = {
  calculateExercisesProgress,
  calculateExercisesAchievementsProgress,
}