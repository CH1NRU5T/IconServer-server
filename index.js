const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const searchRoute = require("./routes/searchRoute");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to IconServer",
  });
});
// custom routes
app.use("/", searchRoute);

app.listen(PORT, () => {
  console.log(`IconServer listening at ${PORT}`);
});
