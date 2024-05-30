var express = require('express');
const DAO = require('../models/DAO');
var router = express.Router();



/* GET home page. */
router.get('/', async function(req, res, next) {
  let dotenv = req.app.get("dotenv");
  let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);
  let stops = await dao.getStops();

  res.render('renfe', {stops: stops});
});

module.exports = router;