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


// Build Inventory management view
invController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()

  // Call the buildclasificationList function from the utilities file
  const classificationSelect = await utilities.buildClassificationList()
  req.flash("notice", "Welcome to Inventory Management")

  // Store notice once
  const messages = req.flash("notice")
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages,
    classificationSelect

  })
}

// Build a function to add classification(get)
invController.buildAddClassification = async function (req, res) {
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
invController.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")

    res.redirect("/inv")
  } else {
    let messages = req.flash("notice", "Failed to add classification.")

    res.render("inventory/add-classification", {
      title: "Add classification",
      nav,
      messages,
      errors: null,

    })


  }
}

//Build addinventory function(get)
invController.buildAddInventory = async function (req, res) {
  try {

    const nav = await utilities.getNav();

    // Build the classification dropdown list
    const classificationList = await utilities.buildClassificationList();


    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,        // dropdown select list
      inv_make: "",             // sticky fields
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      inv_image: "no-image.png",       // default image
      inv_thumbnail: "no-image-thumb.png", // default thumbnail
      messages: [],            // flash message
      errors: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/error", {
      title: "Error",
      message: "Sorry, we appear to have lost that page."
    });
  }
};

// Function to process addinventory fucntion(post)
invController.addInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {
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
  } = req.body

  const result = await invModel.addInventory(
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
  )

  if (result) {
    req.flash("notice", "Inventory item added successfully!")

    nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("notice")
    })
    // Sticky form
  } else {
    req.flash("notice", "Failed to add inventory.")

    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: req.flash("notice"),
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
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    })
  }
}

// Build delete confirmation view
invController.buildDeleteView = async function (req, res) {

  const inv_id = req.params.inv_id

  const item = await invModel.getInventoryById(inv_id)

  res.render("inventory/delete-confirm", {
    title: "Delete Vehicle",
    ...item
  })
}


// Process delete
invController.deleteInventory = async function (req, res) {

  const { inv_id } = req.body

  const result = await invModel.deleteInventory(inv_id)

  if (result) {
    req.flash("notice", "Item deleted successfully")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Delete failed")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

// Process search inventory
invController.searchInventory = async function (req, res) {
  const nav = await utilities.getNav()

  try {
    let { search } = req.query

    if (!search || search.trim() === "") {
      req.flash("notice", "Please enter a search term")
      return res.redirect("/")
    }

    // To sanitize input
    search = search.trim()

    const results = await invModel.searchInventory(search)

    res.render("inventory/search", {
      title: "Search Results",
      nav,
      results,
      search,
      messages: req.flash("notice")
    })

  } catch (error) {
    console.error("controller error:", error)

    req.flash("notice", "Something went wrong. Please try again.")
    res.redirect("/")
  }
}



module.exports = invController