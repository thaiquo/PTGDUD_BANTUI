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

const loginHandler = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!cachedClient) {
            await client.connect();
            cachedClient = client;
        }
        const db = cachedClient.db('Tuixach');
        const collection = db.collection('data');

        const record = await collection.findOne({});
        const user = record?.users?.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export default loginHandler;