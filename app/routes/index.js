var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var data = req.app.get('appData');
  var pageTags = data.superTags;
  res.render('index', {
    pageTitle: 'Home',
    tagsList: pageTags
  });
});

module.exports = router;
