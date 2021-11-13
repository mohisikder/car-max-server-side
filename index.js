const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zz9qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("dream_travel_db");
    const productsCollection = database.collection("products");
    const orderCollection = database.collection("user_order");

    app.get('/', (req, res) =>{
       res.send("Hello carMax")
    })
    
    // POST API (Add Product)
    app.post('/addproduct', async(req, res)=>{
      const newProduct = (req.body);
      const result = await productsCollection.insertOne(newProduct)
      res.json(result)
    })

    // ADD ORDER POST
    app.post('/addorder', async(req, res)=>{
      const newOrder = (req.body)
      const result = await orderCollection.insertOne(newOrder)
      res.json(result)
      console.log(result);
    })
  

    // GET MY ORDER
    app.get('/myorder/:email', async(req, res)=>{
      const query = (req.params.email)
      const result = await orderCollection.find({email : (query)}).toArray()
      res.send(result);
    })

    // GET API
    app.get('/products', async(req,res)=>{
      const result = await productsCollection.find({}).toArray()
      res.send(result)
    })

    // GET ALL Order API
    app.get('/allorder', async(req,res)=>{
      const result = await productsCollection.find({}).toArray()
      res.send(result)
    })

    // Delete ALL Booking API
    app.delete('/allorder/:id', async (req,res) => {
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await orderCollection.deleteOne(query)
      res.send(result)
    })

    // DELETE BOOKING

    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await orderCollection.deleteOne(query)
      res.json(result)
    });
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () =>{
  console.log('Running web server listening on port', port)
})