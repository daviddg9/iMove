var express = require('express');
const DAO = require('../models/DAO');
const StopCard = require('../models/StopCard');
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

router.get('/renfe/paradaRenfe', async function(req, res, next) {
  // TODO: Recoger id de parada de la request
  let stop_id = "18000";
  let dotenv = req.app.get("dotenv");
  let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);
  let stops = await dao.getStops("STOP_ID = " + stop_id);
  let routes = await dao.getRoutes("ROUTE_ID IN (SELECT ROUTE_ID FROM TRIPS INNER JOIN STOP_TIMES ON TRIPS.TRIP_ID = STOP_TIMES.TRIP_ID WHERE STOP_TIMES.STOP_ID = " + stop_id + ")");

  // TODO: Controlar fallos si no se han encontrado paradas/rutas
  if (stops.length == 0 || routes.length == 0) {
    // TODO: lanzar error
    console.log("Error");
  }
  let stopCard = StopCard.fromInstance(stops[0], routes);

  res.render('paradaRenfe', {stopCard: stopCard});
});

router.get('/metro', function(req, res, next) {
  res.render('metro', {
    

  });
});

router.get('/metro/parada', function(req, res, next) {


  res.render('parada', {});
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

router.get('/interurbanos/parada', function(req, res, next) {


  res.render('parada', {});
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

router.get('/urbanos/parada', function(req, res, next) {


  res.render('parada', {});
});


module.exports = router;
