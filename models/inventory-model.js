const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
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

// Add function to add classification_name 
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"

    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

// To add inventory
async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  const sql = `
    INSERT INTO inventory
      (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `
  return await pool.query(sql, [
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  ])
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

// To delete inventory
async function deleteInventory(inv_id) {

  const sql = "DELETE FROM inventory WHERE inv_id = $1"

  const result = await pool.query(sql, [inv_id])

  return result.rowCount
}

// To search inventory using inv_make and model
async function searchInventory(searchTerm) {
  try {
    const sql = `
    SELECT * 
    FROM inventory
    WHERE inv_make ILIKE $1
      OR inv_model ILIKE $1`

    const result = await pool.query(sql, [`%${searchTerm}%`])
    return result.rows
  } catch (error) {
    console.error("Model error:", error)
    throw error
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  searchInventory
}