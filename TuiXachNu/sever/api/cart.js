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

const getCartHandler = async (req, res) => {
  try {
    // ✅ Ensure MongoDB connection using cached client
    if (!cachedClient) {
      await client.connect();
      cachedClient = client;
      console.log("✅ Connected to MongoDB");
    }

    const db = cachedClient.db("Tuixach");
    const collection = db.collection("data");

    const userId = req.params.userId;
    console.log(`🛒 Fetching cart for user ID: ${userId}`);

    // ✅ Find the single document containing all data
    const document = await collection.findOne({});

    if (!document) {
      console.log("⚠️ No document found in the collection");
      return res.status(404).json({ message: "Không tìm thấy dữ liệu." });
    }

    // ✅ Find the user within the users array
    const user = document.users.find(
      (user) => String(user.id) === String(userId)
    );

    if (!user) {
      console.log(`👤 User with ID ${userId} not found`);
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với ID này." });
    }

    // ✅ Extract the user's cart, defaulting to an empty array if it doesn't exist
    const cart = user.cart || [];
    console.log(`🛒 Found cart with ${cart.length} items for user ${userId}`);

    // ✅ Respond with the user's cart
    res.status(200).json({ cart });
  } catch (error) {
    console.error("🔥 Error fetching cart:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy giỏ hàng.",
      error: error.message,
    });
  }
};

export default getCartHandler;