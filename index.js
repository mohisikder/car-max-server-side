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
    const ordersCollection = database.collection("user_order");
    const usersCollection = database.collection("users");

    app.get('/', (req, res) =>{
       res.send("Hello carMax")
    })
    
    // GET API (get Product)
    app.get('/products', async(req, res)=>{
       const result= await productsCollection.find({}).toArray()
       res.send(result)
    })

    // GET all order
    app.get('/orders', async(req, res)=>{
      const cursor = ordersCollection.find({})
      const order = await cursor.toArray()
      res.json(order)
    })
    // GET user wise
    app.get('/orders/:email', async(req, res)=>{
      const email = req.query.email
      const query = {email: email}
      const cursor = ordersCollection.find(query)
      const order = await cursor.toArray()
      res.json(order)
    })

    // Admin Check
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin });
  })


    // get single product
    app.get('/singleProduct/:id', async(req, res)=>{
      const result = await productsCollection.find({_id: ObjectId(req.params.id)}).toArray()
      res.send(result[0]);
    })

   //  Add Product(POST API)
   app.post('/addproduct', async(req, res)=>{
      const newProduct = req.body
      const result = await productsCollection.insertOne(newProduct)
      res.json(result)
   })
   //  Add New user (POST API)
   app.post('/users', async(req, res)=>{
      const newUser = req.body
      const result = await usersCollection.insertOne(newUser)
      res.json(result)
   })

  //  PUT API (User Update)
  app.put('/users', async(req, res)=>{
    const user = req.body
    const filter = {email: user.email}
    const options = { upsert: true }
    const updateDoc = {$set: user}
    const result = await usersCollection.updateOne(filter, updateDoc, options)
    res.json(result)
  })

  //  Order Post API
  app.post('/addorder', async(req, res)=>{
    const order=req.body
    const result = await ordersCollection.insertOne(order)
    res.json(result)
  })

  // User order delete
  app.delete('/delete/:id', async(req, res)=>{
    const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id)})
    res.send(result);
  })

  // Admin PUT
  app.put('/users/admin', async(req, res)=>{
    const user = req.body
    const filter = {email: user.email}
    const updateDoc = {$set: {role: 'admin'}}
    const result = await usersCollection.updateOne(filter, updateDoc)
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