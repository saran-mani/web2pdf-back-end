const express = require("express");
const router = express.Router();
const app =require('../controller/app')
router.route("/").post(app.generatepdf)
module.exports = router ;
