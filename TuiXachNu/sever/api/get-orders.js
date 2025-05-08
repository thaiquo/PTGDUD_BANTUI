import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedClient = null;

const getOrdersHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    if (!cachedClient) {
      await client.connect();
      cachedClient = client;
      console.log("✅ Connected to MongoDB");
    }

    const db = cachedClient.db("Tuixach");
    const collection = db.collection("data");

    const document = await collection.findOne({});
    if (!document) {
      console.error("❌ No document found in collection");
      return res.status(500).json({ error: "Không tìm thấy document chính" });
    }

    const user = document.users?.find((user) => user.id === userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Return the orders, even if the array is empty
    return res.status(200).json({ orders: user.order || [] });
  } catch (err) {
    console.error("❌ Lỗi tải lịch sử đơn hàng:", err);
    return res.status(500).json({ error: "Lỗi đọc dữ liệu MongoDB: " + err.message });
  }
};

export default getOrdersHandler;