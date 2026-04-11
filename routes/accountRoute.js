const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration route
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
// router.post("/login",
//    regValidate.loginRules(),
//   regValidate.checkLoginData,
//   utilities.handleErrors(accountController.accountLogin)
//   // (req, res) => {
//   //   res.status(200).send('login process')
//   // }
// )

// Login validation route
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account route
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement))

// build update view
router.get("/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateView)
)

// Update account view
router.post("/update",
  utilities.handleErrors(accountController.updateAccount)
)

// Update password
router.post("/update-password",
  utilities.handleErrors(accountController.updatePassword)
)

// Logout route
router.get("/logout",
  utilities.handleErrors(accountController.logout)
)

module.exports = router