const express= require('express')
const cors= require('cors')
require("dotenv").config();
const app= express()
const port= process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion } = require('mongodb');

//mongodb


const uri = "mongodb+srv://<username>:<password>@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req,res)=>{
    res.send("Boatfinder server is running")
})

app.listen(port, ()=>{
    console.log(`server running on port ${port} `);
})

