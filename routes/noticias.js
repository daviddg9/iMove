var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('noticias', {
      layout: 'noticias',
      title: "Nuestras noticias", 
      titleNoticia: 'Innovaciones tecnológicas en el transporte público en 2023', 
      noticia: 'En 2023, el transporte público se enfrenta a numerosos desafíos que están siendo abordados mediante innovaciones tecnológicas. Desde la implementación de sistemas de pago sin contacto hasta la incorporación de vehículos eléctricos y autónomos, las ciudades están adoptando soluciones tecnológicas para mejorar la eficiencia y la sostenibilidad del transporte público ',
      
    
    
    
    
    
    
    
    });
  });

module.exports = router;
