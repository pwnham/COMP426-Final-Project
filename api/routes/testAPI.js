var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  var i = 0;
  for (var x = 0; x < 5; x++) {
    i++;
  }
  res.send("API is working properly" + i);
});

module.exports = router;
