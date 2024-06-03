var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('transportePrivado', {
      layout: 'transportePrivado',
      title: "transportePrivado"
    });
  });

module.exports = router;
