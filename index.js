const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Collectins
    const categoryCollection = client.db("boatFinder").collection("categories");
    const userCollection = client.db("boatFinder").collection("users");
    const boatCollection = client.db("boatFinder").collection("boats");
    const bookingCollection = client.db("boatFinder").collection("booking");

    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all products under a category

    app.get("/category/:id", async (req, res) => {
      const category = req.params.id;
      const query = { productCategory: category };
      const products = await boatCollection.find(query).toArray();
      res.send(products);
    });

    //bookings by a buyer

    app.get("/booking/:id", async (req, res) => {
      const email = req.params.id;
      const query = { buyerEmail: email };
      const booking = await bookingCollection.find(query).toArray();
      res.send(booking);
    });

    //get sellers
    app.get("/seller", async (req, res) => {
      const query = { role: "seller" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    //get buyers
    app.get("/buyer", async (req, res) => {
      const query = { role: "buyer" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // Get products added by a seller
    app.get("/myproducts", async (req, res) => {
      const email = req.query.email;
      const query = { sellerEmail: email };
      const products = await boatCollection.find(query).toArray();
      res.send(products);
    });

    //get advertisement
    app.get('/advertisement', async(req,res)=> {
      const query= {advertised: 'true'}
      const advertisement= await boatCollection.find(query).toArray()
      res.send(advertisement)
    })
    //advertise product
    app.put("/advertise/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const advertiseStatus = req.body;
      const option = { upsert: true };
      const updataAdvertise = {
        $set: {
          advertised: advertiseStatus.advertised,
        },
      };
      const result = await boatCollection.updateOne(
        filter,
        updataAdvertise,
        option
      );

      res.send(result);
    });

    //delete product
    app.delete("/myproductdelete/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: new ObjectId(id) };
      const result = await boatCollection.deleteOne(remove);
      res.send(result);
    });

    //add product
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await boatCollection.insertOne(product);
      res.send(result);
    });

    //save booking
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //save user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    //delete a seller
    app.delete("/seller/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(remove);
      res.send(result);
    });
    //delete buyer
    app.delete("/buyer/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(remove);
      res.send(result);
    });

    // verify seller
    app.put("/seller/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const sellerStatus = req.body;
      const option = { upsert: true };
      const updateSeller = {
        $set: {
          verified: sellerStatus.verified,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateSeller,
        option
      );

      res.send(result);
    });

    // verify buyer
    app.put("/buyer/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const buyerStatus = req.body;
      const option = { upsert: true };
      const updateBuyer = {
        $set: {
          verified: buyerStatus.verified,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateBuyer,
        option
      );

      res.send(result);
    });
    //check admin role

    app.get("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    //check buyer role
    app.get("/user/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });

    //check seller role
    app.get("/user/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
      console.log(user);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Boatfinder server is running");
});

app.listen(port, () => {
  console.log(`server running on port ${port} `);
});
