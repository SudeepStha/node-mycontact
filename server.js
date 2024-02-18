const express = require('express');
const dotenv = require('dotenv').config();
const errorHandler = require("../mycontact-backend/middleware/errorHandler")
const connectDb = require('../mycontact-backend/config/dbConnection')
connectDb();
const app = express();
const port = 5000 || process.env.PORT;

// app.get('/api/contacts', (req,res) => {
//     // res.send("Get all contacts."); //for normal response
//     // res.json({message: "Get all contacts"}); // in json format
//     res.status(200).json({message: "Get all contacts"}); // in json format with status code
// })
 
app.use(express.json());
app.use("/api/contacts", require('../mycontact-backend/rotues/contactRoutes'))
app.use("/api/users", require('../mycontact-backend/rotues/userRoutes'))
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})