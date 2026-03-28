const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 * Get inventory by classification id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getInventoryByClassificationId:", error);
    throw error;
  }
}

/* ***************************
 * Get single inventory item by inventory id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0]; // returns a single object
  } catch (error) {
    console.error("Error in getInventoryById:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
}