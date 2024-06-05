var express = require('express');
const DAO = require('../models/DAO');
const StopCard = require('../models/StopCard');
var router = express.Router();

Date.prototype.addHours = function(h) {
  this.setHours(this.getHours() + h);
  return this;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('transportePublico', {
    

  });
});

router.get('/renfe', async function(req, res, next) {
  let dotenv = req.app.get("dotenv");
  let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);
  let stops = await dao.getStops();
  let stopRoutes = {};
  
  for (const stop of stops) {
    stopRoutes[stop.STOP_ID] = await dao.getRoutesSingleByStopId(stop.STOP_ID);
  }

  res.render('renfe', {stops: stops, stopRoutes: stopRoutes});
});


router.get('/renfe/paradaRenfe', async function(req, res, next) {
  // TODO: Recoger id de parada de la request
  let stop_id = req.query.stop_id;
  let dotenv = req.app.get("dotenv");
  let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);
  let stops = await dao.getStops("STOP_ID = " + stop_id);
  let routes = await dao.getRoutesByStopId(stop_id);
  let routesSingle = await dao.getRoutesSingleByStopId(stop_id);

  let date_now = "" + new Date();
  let date_end = "" + new Date().addHours(1);
  let time_now = date_now.split(" ")[4];
  let time_end = date_end.split(" ")[4];

  let stopTimes = await dao.getFutureStopTimesByStopId(stop_id, time_now, time_end);

  // TODO: Controlar fallos si no se han encontrado paradas/rutas
  if (stops.length == 0 || routes.length == 0 || stopTimes.length == 0) {
    // TODO: lanzar error
    console.log("Error");
  }

  for (const route of routes) {
    let trips = await dao.getTripsByRouteId(route.ROUTE_ID);
    let trip_ids = [];
    for (const trip of trips) {
      trip_ids.push(trip.TRIP_ID);
    }
    route.RENFE_STOP_TIMES = stopTimes.filter((stopTime) => trip_ids.includes(stopTime.TRIP_ID));
    //let routeUnique = route.RENFE_STOP_TIMES.filter((stop_time, index, array) => array.indexOf(stop_time.DEPARTURE_TIME) === index);
    //console.log(routeUnique);
  }

  let routes_filtered = routes.filter((route) => route.RENFE_STOP_TIMES.length > 0);
  
  //console.log(routes_filtered);

  let stopCard = StopCard.fromInstance(stops[0], routes_filtered);

  res.render('paradaRenfe', {stopCard: stopCard, routesSingle: routesSingle});
});

router.get('/renfe/planos', function(req, res, next) {


  res.render('planos', {});
});

router.get('/metro', function(req, res, next) {
  res.render('metro', {
    

  });
});

router.get('/metro/paradaMetro', function(req, res, next) {


  res.render('paradaMetro', {});
});

router.get('/metro/planos', function(req, res, next) {


  res.render('planos', {});
});



router.get('/interurbanos', function(req, res, next) {
  res.render('interurbanos', {
    placeholderText : "Código de parada",
    buttonTextSearch : "Buscar",
    instructionText1 : "Busca el código de la parada en la marquesina",
    instructionText2 : "Si no lo encuentra, busque en los planos",
    buttonTextHorario : "Horario"
  });
});

router.get('/interurbanos/parada', function(req, res, next) {


  res.render('parada', {});
});

router.get('/interurbanos/planos', function(req, res, next) {


  res.render('planos', {});
});

router.get('/urbanos', function(req, res, next) {
  res.render('urbanos', {
    placeholderText : "Código de parada",
    buttonTextSearch : "Buscar",
    instructionText1 : "Busca el código de la parada en la marquesina",
    instructionText2 : "Si no lo encuentra, busque en los planos",
    buttonTextHorario : "Horario"
  });
});

router.get('/urbanos/parada', function(req, res, next) {


  res.render('parada', {});
});

router.get('/urbanos/planos', function(req, res, next) {


  res.render('planos', {});
});


module.exports = router;
