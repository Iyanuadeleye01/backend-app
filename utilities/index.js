const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list +="<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '"title="See our inventory of ' +
            row.classification_name +
            'vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"

    })
    list += "</ul>"
    return list
}


/* ************************
 * Build classification grid (list of vehicles)
 ************************** */
Util.buildClassificationGrid = function(data) {
  let list = '<ul class="vehicle-grid">';

  data.rows.forEach(vehicle => {
    list += `
      <li>
        <a href="/inv/details/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        </a>
      </li>
    `;
  });

  list += '</ul>';
  return list;
};

/* ************************
 * Build single vehicle detail HTML
 ************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) return "<p>Vehicle not found.</p>";

  // Format price and mileage
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(vehicle.inv_price);

  const mileage = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Transmission:</strong> ${vehicle.inv_transmission || "N/A"}</p>
      </div>
    </div>
  `;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions for general error handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
