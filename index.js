const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdbndcb.mongodb.net/?retryWrites=true&w=majority`;

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

        const noteCollection = client.db('noteDB').collection('notes');

        // notes api
        app.post('/notes', async (req, res) => {
            const data = req.body;
            const result = await noteCollection.insertOne(data);
            res.send(result);
        })

        app.get('/notes', async (req, res) => {
            const result = await noteCollection.find().toArray();
            res.send(result);
        })

        app.get('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await noteCollection.findOne(query);
            res.send(result);
        })

        app.patch('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateNote = req.body;
            const updatedDoc = {
                $set: {
                    title: updateNote.title,
                    month: updateNote.month,
                    note: updateNote.note
                }
            }
            const result = await noteCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        app.delete('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await noteCollection.deleteOne(query);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('note book server is running');
})

app.listen(port, () => {
    console.log(`note book server is running on port ${port}`);
})