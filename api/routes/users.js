var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  // res.send('respond with a resource');
  res.send([{ name: "bill" }, { name: "megan" }]);
});

module.exports = router;
