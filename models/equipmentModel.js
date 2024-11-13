const { pool } = require('../config/database');

/**
 * Retrieves all equipment from the database.
 *
 * @returns {Array|null} - An array of equipment objects if found, or null if no equipment exists.
 */
const selectEquipment = async () => {
  const query = 'SELECT * FROM equipment';

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

/**
 * Retrieves a single piece of equipment from the database by its ID.
 *
 * @param {number} equipment_id - The ID of the equipment to retrieve.
 * @returns {Object|null} - The equipment object if found, or null if no equipment exists with the given ID.
 */
const selectEquipmentById = async (equipment_id) => {
  const query = 'SELECT * FROM equipment WHERE id = $1';
  const values = [equipment_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

module.exports = {
  selectEquipment,
  selectEquipmentById,
}