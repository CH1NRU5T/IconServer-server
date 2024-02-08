const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");
router.post("/search", (req, res) => {
  console.log("search route");
  searchController(req, res);
});
module.exports = router;
