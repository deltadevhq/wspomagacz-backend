const { pool } = require('../config/database');

// CONSIDER: EVENTS FOR SPECIFIC EXERCISES / MUSCLES GROUPS

const userExperienceHandler = async (workout) => {
  console.log(`Start user experience handler for workout id: ${workout.id}, user id: ${workout.user_id}`);
  try {
    let xp = 10;
    const multiplier = await calculateMultiplier(workout.user_id);

    // TODO: LOOP FOR EVERY SET IN WORKOUT
    // TODO: EXTRA EXPERIENCE FOR EACH PERSONAL RECORD
    // TODO: CHECK IF WORKOUT IS RANKED?

    const totalXP = Math.round(xp * multiplier);
    console.log(`Finished user experience handler with xp result: ${totalXP}`);
    return totalXP;
   } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

const calculateMultiplier = async (user_id) => {
  try {
    console.log(`Start calculating experience multiplier`);
    let totalMultiplier = 1.00;

    // Sum multipliers from events
    const events = await fetchEvents(user_id);
    events.forEach(event => {
      totalMultiplier += --event.multiplier;
    });

    console.log(`Total multiplier: ${totalMultiplier.toFixed(2)}`);
    return totalMultiplier;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

const fetchEvents = async (user_id) => {
  console.log(`Fetching events for multiplier calculation...`);
  const query = `SELECT * FROM events WHERE (user_id = $1 OR user_id IS NULL) AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE;`;
  const values = [user_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : [ { multiplier: 1.00 } ];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  userExperienceHandler,
  calculateMultiplier
}