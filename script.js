require('dotenv').config();
const cors = require('cors')
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT

const uri = process.env.MONGO_URI;


app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Server is running ')
})



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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // ===============Collections============================
    const db = client.db('NeyamulFolio');
    const projectCollection = db.collection('projects')









    // ====================All API============================
    app.get('/projects',async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.json(result);
    })




     app.get('/projects/:id', async (req, res) => {
    const { id } = req.params

    // Validate before converting, otherwise you'll hit the BSONError
    // you already ran into once.
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project id' })
    }

    try {
      const project = await projectCollection.findOne({
        _id: new ObjectId(id),
      })

      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      res.status(200).json(project)
    } catch (error) {
      console.error('Error fetching project:', error)
      res.status(500).json({ message: 'Failed to fetch project' })
    }
  })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})