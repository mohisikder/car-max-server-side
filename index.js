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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});


async function run() {
  try {
    await client.connect();
    const database = client.db('car_max_db');
    const productsCollection = database.collection("products");
    const orderCollection = database.collection("user_order");

    app.get('/', (req, res) =>{
       res.send("Hello carMax")
    })
    
    // GET API (get Product)
    app.get('/products', async(req, res)=>{
       const result= await productsCollection.find({}).toArray()
       res.send(result)
    })

   //  Add Product(POST API)
   app.post('/addproduct', async(req, res)=>{
      const newProduct = req.body
      const result = await productsCollection.insertOne(newProduct)
      res.json(result)
   })
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () =>{
  console.log('Running web server listening on port', port)
})