var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/paradaRenfe', async function(req, res, next) {

  res.render('paradaRenfe', {


  });
});

module.exports = router;
