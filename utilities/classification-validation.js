const utilities = require(".")
const{body, validationResult} = require("express-validator")
 

validate = {}

// Classification rules
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isAlphanumeric()
        .withMessage("No spaces or special characters allowed.")
    ]
}

// Validate classification rules
validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()

        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name: req.body.classification_name

        })
    }
    next()
}

module.exports = validate