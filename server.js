const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const database = client.db('perceptflow');
    const drawingsCollection = database.collection('drawings');

    // Middleware
    app.use(cors());
    app.use(express.json());

    // API to save a drawing
    app.post('/api/drawings', async (req, res) => {
      const drawing = req.body;
      const result = await drawingsCollection.insertOne(drawing);
      res.status(201).json(result);
    });

    // API to get all drawings
    app.get('/api/drawings', async (req, res) => {
      const drawings = await drawingsCollection.find({}).toArray();
      res.status(200).json(drawings);
    });

    app.get('/', (req, res) => {
      res.send('Welcome to PerceptFlow API!');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);