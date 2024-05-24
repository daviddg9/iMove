var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('urbanos', {
      placeholderText : "Código de parada",
      buttonTextSearch : "Buscar",
      instructionText1 : "Busca el código de la parada en la marquesina",
      instructionText2 : "Si no lo encuentras busca en estas seccion",
      buttonTextHorario : "Horario",
    
    
    
    
    
    
    
    });
  });

module.exports = router;