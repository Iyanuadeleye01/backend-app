-- Task 1
INSERT INTO account(account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Task 3
DELETE FROM account
WHERE 'account_email' = 'tony@starkent.com';

-- Task4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task5
SELECT inv_make, inv_model, classification_name 
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE classification_name ='Sport';

-- Task 6
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images','/images/vehicles');


// saved here
-- async function accountLogin(req, res) {
--   const { account_email, account_password } = req.body

--   const account = await accountModel.getAccountByEmail(account_email)
--   if (!account) {
--     return res.render("account/login", {
--       title: "Login",
--       errors: [{ msg: "Email or password is incorrect" }],
--       account_email
--     })
--   }

--   // const passwordMatch = await bcrypt.compare(account_password, account.account_password)
--   // if (!passwordMatch) {
--   //   return res.render("account/login", {
--   //     title: "Login",
--   //     errors: [{ msg: "Email or password is incorrect" }],
--   //     account_email
--   //   })
--   // }

--   // // Success → create session
--   // req.session.account = account
--   // res.redirect("/account/dashboard")
-- }

<!-- <div id="tools">
    <a title="Click to log in" href="/account/login">My Account</a>
  </div> -->