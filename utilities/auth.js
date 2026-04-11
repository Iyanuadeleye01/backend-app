const jwt = require("jsonwebtoken")


// To check webtoken
function checkJWT(req, res, next) {
    if(req.cookies.jwt){
        try{
            const decoded = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
            res.locals.accountData = decoded
            res.locals.loggedin = true

        }catch(err){
            res.locals.loggedin = false
        }
    }else {
        res.locals.loggedin = false
    }
    next()
}

// Employee or admin priviledge access

// Middleware for authorization
function checkEmployeeOrAdmin(req, res, next) {

  // Check if user is logged in
  if (res.locals.loggedin) {

    const type = res.locals.accountData.account_type

    // Allow only Employee or Admin
    if (type === "Employee" || type === "Admin") {
      return next()
    }
  }

  // If unauthorized
  req.flash("notice", "You must be logged in as Employee or Admin")
  res.render("account/login", {
    title: "Login"
  })
}


module.exports = {checkJWT, checkEmployeeOrAdmin}