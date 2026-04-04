const express = require('express');
const router = express.Router();
const utilities = require("../utilities")
const inValidate = require("../utilities/classification-validation")
const invController = require("../controllers/invController")

// To show form
router.get("/add-classification",
    invController.buildAddClassification
)

// Process form
router.post("/add-classification",
    inValidate.classificationRules(),
    inValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

module.exports = router