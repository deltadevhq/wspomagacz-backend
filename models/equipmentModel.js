const pool = require('../config/database');

// Fetch all equipment
const getEquipment = async () => {
  try {
    const query = 'SELECT * FROM equipment';

    const result = await pool.query(query);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
};

// Fetch single equipment
const getEquipmentById = async (equipmentId) => {
  try {
    const query = 'SELECT * FROM equipment WHERE id = $1';
    const values = [equipmentId];

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