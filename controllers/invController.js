const invModel = require("../models/inventory-model")
const utilities = require("../utilities")


const invController = {};

/* ***************************
 * Build list of vehicles by classification
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classification_id;

    // Fetch vehicles for this classification
    const vehicles = await invModel.getInventoryByClassificationId(classification_id);

    const nav = await utilities.getNav();

    // Handle empty result
    if (!vehicles || vehicles.length === 0) {
      return res.render("inventory/classification", {
        title: "No vehicles found",
        nav,
        vehiclesHtml: "<p>No vehicles found in this classification.</p>"
      });
    }

    // Build HTML grid for vehicles
    // Wrap in { rows: vehicles } because utility expects .rows
    const vehiclesHtml = utilities.buildClassificationGrid({ rows: vehicles });

    res.render("inventory/classification", {
      title: "Vehicle List",
      nav,
      vehiclesHtml
    });

  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build single vehicle detail view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;

    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();

    // Handle case if vehicle not found
    if (!vehicle) {
      return res.status(404).render("error", {
        title: "Vehicle Not Found",
        nav,
        message: "No vehicle found with that ID."
      });
    }

    // Build vehicle HTML using utility
    const vehicleHtml = utilities.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHtml
    });

  } catch (error) {
    next(error); // pass error to middleware
  }
};

/* ***************************
 * Intentional server error
 * ************************** */
invController.triggerError = function (req, res, next) {
  throw new Error("Intentional Server Error");
};

module.exports = invController;