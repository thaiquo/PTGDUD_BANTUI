import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let cachedClient = null;

const getData = async(req, res) => {
    try {
        if (!cachedClient) {
            await client.connect();
            cachedClient = client;
            console.log('✅ Connected to MongoDB');
        }

        const db = cachedClient.db('Tuixach');
        const collection = db.collection('data');

        const result = await collection.find().toArray();

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '❌ MongoDB query failed' });
    }
};

export default getData;