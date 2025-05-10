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

const addToCartHandler = async (req, res) => {
  try {
    // ✅ Ensure MongoDB connection
    if (!cachedClient) {
      await client.connect();
      cachedClient = client;
      console.log("✅ Connected to MongoDB");
    }

    const db = cachedClient.db("Tuixach");
    const collection = db.collection("data");

    const userId = req.params.userId;
    const { idProduct, quantity } = req.body;

    console.log(
      `🛒 Adding to cart - userId: ${userId}, productId: ${idProduct}, quantity: ${quantity}`
    );

    // ✅ Input validation
    if (!idProduct || !quantity || quantity <= 0) {
      console.log("❌ Invalid input data");
      return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ." });
    }

    // ✅ Find the main document
    const document = await collection.findOne({});
    if (!document) {
      console.log("⚠️ No document found in the collection");
      return res.status(404).json({ message: "Không tìm thấy dữ liệu." });
    }

    // ✅ Find the user
    const userIndex = document.users.findIndex(
      (user) => String(user.id) === String(userId)
    );
    if (userIndex === -1) {
      console.log(`👤 User with ID ${userId} not found`);
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với ID này." });
    }
    console.log(`👤 Found user at index ${userIndex}`);

    // 🔍 Find the product details
    const product = document.sanpham.find(
      (p) => String(p.id) === String(idProduct)
    );
    if (!product) {
      console.log(`📦 Product with ID ${idProduct} not found`);
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // 🧮 Calculate the price (with potential discount)
    const rawPrice = Number(product.giaTien.replace(/[₫,.]/g, ""));
    const price = product.trangThai === 0 ? Math.round(rawPrice * 0.9) : rawPrice;

    // Initialize the cart if it doesn't exist
    const cart = document.users[userIndex].cart || [];

    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(
      (item) => String(item.idProduct) === String(idProduct)
    );

    if (existingItemIndex !== -1) {
      // 🔄 Update quantity if the product exists
      console.log(
        `🔄 Updating quantity for product ${idProduct} to ${quantity}`
      );
      cart[existingItemIndex].quantity = Number.parseInt(quantity, 10);
      cart[existingItemIndex].price = price; // Update price in case product status changed
    } else {
      // ✨ Add new product to the cart
      const maxId =
        cart.length > 0 ? Math.max(...cart.map((item) => Number(item.id))) : 0;
      const newItem = {
        id: maxId + 1,
        idProduct,
        quantity: Number.parseInt(quantity, 10),
        price,
      };
      console.log("✨ Adding new item to cart:", newItem);
      cart.push(newItem);
    }

    // 💾 Update the user's cart in the database
    document.users[userIndex].cart = cart; // Update the document before saving

    const result = await collection.updateOne(
      { _id: document._id },
      { $set: { [`users.${userIndex}.cart`]: cart } }
    );

    console.log("✅ Cart update result:", result);

    if (result.matchedCount === 0) {
      console.log("⚠️ No document matched for update");
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài liệu để cập nhật." });
    }

    console.log(`🛒 Successfully updated cart for user ${userId}`);
    res.status(200).json({
      message: "Sản phẩm đã được thêm vào giỏ hàng.",
      modifiedCount: result.modifiedCount,
      cart,
    });
  } catch (error) {
    console.error("🔥 Error adding product to cart:", error);
    res.status(500).json({
      message: "Lỗi server khi thêm sản phẩm vào giỏ hàng.",
      error: error.message,
    });
  }
};

export default addToCartHandler;