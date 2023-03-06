const express= require('express')
const cors= require('cors')
require("dotenv").config();
const app= express()
const port= process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion } = require('mongodb');

//mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try{
        // Collectins
        const categoryCollection= client.db('boatFinder').collection('categories')
            

        app.get( '/categories', async (req,res)=>{
            const query= {}
            const cursor= categoryCollection.find(query)
            const result= await cursor.toArray()
            res.send(result)
        })

        //save user
        app.post('/user', async(req,res)=> {
            const user= req.body
            const result= await userColleciton.inserOne(user)
            res.send(user)
        })

    }

   finally{

   }
}

run().catch(err=>console.log(err))


app.get('/', (req,res)=>{
    res.send("Boatfinder server is running")
})

app.listen(port, ()=>{
    console.log(`server running on port ${port} `);
})

