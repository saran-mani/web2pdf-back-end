const express = require("express");
const cors = require("cors");
const appRoutes=require("./routes/app")
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.get("/",(req,res)=>{
  res.send(`<h1>Home</h1>`)
})
app.use("/generatepdf",appRoutes);

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
