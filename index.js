const express = require('express');
const cors= require('cors');
const app =express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.515cnfu.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((error) => {
      if (error) {
        console.error(error);
        return;
      }
    });

    const toyCollection=client.db('carMaster').collection('toys')

    //toys
    app.get('/toys', async(req,res)=>{
      console.log(req.query.email);
      let query={}
      if(req.query?.email){
        query={email:req.query.email}
      }
      const result= await toyCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/toys', async(req,res)=>{
      const toys=req.body;
      console.log(toys)
      const result= await toyCollection.insertOne(toys)
      res.send(result)
    })

    app.get('/toys/:id', async(req,res)=>{
      const id = req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await toyCollection.findOne(query)
      res.send(result)

    })


    app.put('/toys/:id', async(req,res)=>{
      const id= req.params.id;
      const filter= {_id: new ObjectId(id)}
      const options={upsert:true};
      const updatedToy=req.body;
      const toy={
        $set:{
          name:updatedToy.carName,
          price:updatedToy.price,
          quantity:updatedToy.quantity,
          seller:updatedToy.seller,
          description:updatedToy.description,
        }
      }

      const result = await toyCollection.updateOne(filter,toy,options)
      res.send(result)
    })

    app.delete('/toys/:id', async(req,res)=>{
      const id=req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/shop', async(req,res)=>{
      const category=req.query.category;
      const query={category:category}
      const result= await toyCollection.find(query).toArray()
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


app.get('/', (req,res)=>{
    res.send('toy is running')
})

app.listen(port, ()=>{
    console.log(`toy server is running on port : ${port}`)
})
