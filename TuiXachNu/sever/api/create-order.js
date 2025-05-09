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

    // Tính thời gian theo múi giờ Việt Nam (UTC+7)
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Format orderid theo ddMMyyyyHHmm
    const orderid = `${String(vietnamTime.getDate()).padStart(2, "0")}${String(
      vietnamTime.getMonth() + 1
    ).padStart(2, "0")}${vietnamTime.getFullYear()}${String(vietnamTime.getHours()).padStart(
      2,
      "0"
    )}${String(vietnamTime.getMinutes()).padStart(2, "0")}`;

    // Đơn hàng mới
    const newOrder = {
      orderid,
      nameorder: shippingInfo.fullName,
      phone: shippingInfo.phone,
      listorder: items,
      createdAt: vietnamTime.toISOString(), // Lưu timestamp chuẩn ISO
    };

    // Nếu chưa có mảng order thì tạo mới
    if (!document.users[userIndex].order) {
      document.users[userIndex].order = [];
    }

    // Thêm đơn hàng mới vào đầu danh sách
    document.users[userIndex].order.unshift(newOrder);

    // Xóa các sản phẩm đã đặt khỏi giỏ hàng
    const itemIds = items.map((item) => item.idProduct);
    if (!document.users[userIndex].cart) {
      document.users[userIndex].cart = [];
    }
    document.users[userIndex].cart = document.users[userIndex].cart.filter(
      (item) => !itemIds.includes(item.idProduct)
    );

    // Cập nhật dữ liệu trên MongoDB
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
