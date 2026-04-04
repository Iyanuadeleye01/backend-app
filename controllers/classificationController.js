classModel = require("../models/classification-model")
utilities = require("../utilities")


classificationController = {}

// Build a function to add classification(get)
classificationController.buildAddClassification = async function(req, res) {
    let nav = await utilities.getNav()

    let messages = req.flash("notice")
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        messages,
        errors: null,
        
    })
}

// Add a function to process the classification form(post)
classificationController.addClassification = async function(req, res) {
    let nav = await utilities.getNav()
    const{classification_name} = req.body

    const result = await classModel.addClassification(classification_name)

    if (result) {
        req.flash("notice", "Classification added successfully.")

        res.redirect("/inv")
    }else{
        let messages = req.flash("notice", "Failed to add classification.")

        res.render("inventory/add-classification", {
            title: "Add classification",
            nav,
            messages,
            errors: null,
           
        })


    }
}

module.exports = classificationController