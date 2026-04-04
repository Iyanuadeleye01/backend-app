const pool = require("../database")


async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1)"

        return await pool.query(sql, [classification_name])
    }catch(error) {
        return error.message
    }
}