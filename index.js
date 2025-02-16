const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("The day of Love is ongoing");
})

app.listen(port, ()=>{
    console.log(`The day of generating love letter is running on port: ${port}`)
})