const workoutModel = require('../../models/workoutModel');

const achievement_types = [ 'workout_count', 'workout_weight', 'total_weight' ];

/**
 * Calculates the progress of workout count achievements for a user.
 *
 * @param {number} workout_total_weight - The total weight lifted in the workout.
 * @param {Array} user_achievements - The user's current achievements, including their progress and IDs.
 * @param {Array} all_achievements - All available achievements with their target values and types.
 * @param {number} user_id - The ID of the user for whom the achievement progress is calculated.
 * @returns {Promise<Array>} - A promise that resolves with an array of achievement progress objects for the user.
 */
const calculateWorkoutAchievementsProgress = async (workout_total_weight, user_achievements, all_achievements, user_id) => {
  let achievements_progress = [];

  const achievements = all_achievements.filter(achievement => achievement_types.includes(achievement.type));

  const { workout_count } = await workoutModel.selectUserCompletedWorkoutsCount(user_id, 'completed');
  const user_completed_workout_count = Number(workout_count);

  for (const achievement of achievements) {
    const { id: achievement_id, type, min_value, target_value, xp: exp } = achievement;

    const user_achievement = user_achievements.find(user_achievement => user_achievement.achievement_id === achievement_id);
    if (user_achievement?.achieved) {
      continue;
    }

    let current_value = user_achievement?.current_value || 0;

    switch (type) {
      case 'workout_count':
        current_value = user_completed_workout_count;
        break;
      case 'workout_weight':
        current_value = workout_total_weight;
        break;
      case 'total_weight':
        current_value += workout_total_weight;
        break;
      default:
        continue;
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
  calculateWorkoutAchievementsProgress,
}