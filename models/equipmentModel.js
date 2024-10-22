const { pool } = require('../config/database');

/**
 * Select all equipment from database
 */
const getEquipment = async () => {
  const query = 'SELECT * FROM equipment';

  try {
    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

/**
 * Select single equipment from database by its ID
 */
const getEquipmentById = async (equipment_id) => {
  const query = 'SELECT * FROM equipment WHERE id = $1';
  const values = [equipment_id];

  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

module.exports = {
  getEquipment,
  getEquipmentById
};