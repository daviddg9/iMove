var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('metro', {
    name  : 'albacete',
    line : '11',
    

  
  
  
  });
});

module.exports = router;