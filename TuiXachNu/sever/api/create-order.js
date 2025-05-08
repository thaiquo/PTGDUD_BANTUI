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

const createOrder = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, items, shippingInfo } = req.body;

  if (!userId || !items || items.length === 0 || !shippingInfo) {
    return res.status(400).json({ error: "User ID, items, and shipping info are required" });
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

    const userIndex = document.users?.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      console.error(`❌ User not found: ${userId}`);
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Generate order ID based on current date and time (ddMMyyyyHHmm)
    const now = new Date();
    const orderid = `${String(now.getDate()).padStart(2, "0")}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${now.getFullYear()}${String(now.getHours()).padStart(
      2,
      "0"
    )}${String(now.getMinutes()).padStart(2, "0")}`;

    // Create new order (removed status and createdAt)
    const newOrder = {
      orderid,
      nameorder: shippingInfo.fullName,
      phone: shippingInfo.phone,
      listorder: items,
    };

    // Initialize order array if it doesn't exist
    if (!document.users[userIndex].order) {
      document.users[userIndex].order = [];
    }

    // Add new order to user's order array
    document.users[userIndex].order.unshift(newOrder);

    // Remove ordered items from cart
    const itemIds = items.map((item) => item.idProduct);
    if (!document.users[userIndex].cart) {
      document.users[userIndex].cart = []; // Initialize cart if it doesn't exist
    }
    document.users[userIndex].cart = document.users[userIndex].cart.filter(
      (item) => !itemIds.includes(item.idProduct)
    );

    // Update document in MongoDB
    const updateResult = await collection.updateOne(
      { _id: document._id },
      { $set: { users: document.users } }
    );

    if (updateResult.modifiedCount === 0) {
      console.error(`❌ Failed to update document for user: ${userId}`);
      return res.status(500).json({ error: "Không thể cập nhật đơn hàng" });
    }

    console.log(`✅ Đã tạo đơn hàng mới: ${orderid} cho người dùng: ${userId}`);
    return res.status(200).json({
      message: "Đặt hàng thành công",
      orderId: orderid,
    });
  } catch (err) {
    console.error("❌ Lỗi tạo đơn hàng:", err);
    return res.status(500).json({ error: "Lỗi ghi dữ liệu MongoDB: " + err.message });
  }
};

export default createOrder;