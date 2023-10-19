const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mctvfu.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const cartCollection=client.db("productDB").collection("cart")


    app.get("/products",async(req,res)=>{
      const cursor = productCollection.find();
      const result =await cursor.toArray();
      res.send(result)
    })


    app.get("/products/:name", async (req, res) => {
      const name = req.params.name;
      const query = { brand_name : name };
      const result = await productCollection.find(query).toArray();
      res.send(result);
  })



    app.post('/products',async(req,res)=>{
      const addProduct=req.body;
      console.log(addProduct);
      const result= await productCollection.insertOne(addProduct);
      res.send(result)
    })


    //cart collection

    app.get("/carts",async(req,res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post("/carts",async(req,res)=>{
      const cart=req.body;
      console.log(cart);
      const result=await cartCollection.insertOne(cart);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/",(req,res)=>{
    res.send("Add Product server is running")
})

app.listen(port,()=>{
    console.log(`Add Product port: ${port}`)
})