
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}


/* ***************************
 *  Inventory Data Validation Rules
 * ************************** */
validate.newInventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Make is required."),
    // inv_model
    body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Model is required."),
    //inv_year
    body("inv_year")
    .isInt({ min: 1900, max: 2099 })
    .withMessage("Valid year required."),
    //inv_description
    body("inv_description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description is required."),
    // inv_price
    body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Valid price required."),
    // inv_miles
    body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a number."),
    // inv_color
    body("inv_color")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Color is required."),
  ]
}

// Check inventory data
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      errors: errors.array()
    })
  }

  next()
}


// Check updated data
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body

  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      errors: errors.array()
    })
  }

  next()
}

module.exports = validate