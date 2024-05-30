var express = require('express');
const DAO = require('../models/DAO');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('transportePublico', {
    

  });
});

router.get('/renfe', async function(req, res, next) {
  let dotenv = req.app.get("dotenv");
  let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);
  let stops = await dao.getStops();

  res.render('renfe', {stops: stops});
});

router.get('/metro', function(req, res, next) {
  res.render('metro', {
    

  });
});

router.get('/interurbanos', function(req, res, next) {
  res.render('interurbanos', {
    placeholderText : "Código de parada",
    buttonTextSearch : "Buscar",
    instructionText1 : "Busca el código de la parada en la marquesina",
    instructionText2 : "Si no lo encuentras busca en estas secciones",
    buttonTextHorario : "Horario"
  });
});

router.get('/urbanos', function(req, res, next) {
  res.render('urbanos', {
    placeholderText : "Código de parada",
    buttonTextSearch : "Buscar",
    instructionText1 : "Busca el código de la parada en la marquesina",
    instructionText2 : "Si no lo encuentras busca en estas secciones",
    buttonTextHorario : "Horario"
  });
});

module.exports = router;
