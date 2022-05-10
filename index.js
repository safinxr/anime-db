const express = require('express');
const cors = require('cors');
const app =express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pp6ib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const animeCollection = client.db("best_anime").collection("anime");
        
        app.get('/animes', async(req, res)=>{
            const query ={};
            const cursor = animeCollection.find(query);
            const anime = await cursor.toArray();
            res.send(anime) 
        })

        app.post('/animes', async(req, res) =>{
            const newAnime =req.body;
            const result =await animeCollection.insertOne(newAnime);
            res.send(result);
        })

        app.delete('/animes/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await animeCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('running...')
})

app.listen(port, ()=>{
    console.log('server is running on ', port)
})