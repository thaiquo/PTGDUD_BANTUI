import dotenv from "dotenv"
dotenv.config()
import { MongoClient, ServerApiVersion } from "mongodb"

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let cachedClient = null

const updateCartHandler = async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!cachedClient) {
      await client.connect()
      cachedClient = client
      console.log("✅ Connected to MongoDB")
    }

    const db = cachedClient.db("Tuixach")
    const collection = db.collection("data")

    const userId = req.params.userId
    const { idProduct, quantity } = req.body

    console.log(`Updating cart - userId: ${userId}, productId: ${idProduct}, quantity: ${quantity}`)

    // Input validation
    if (!idProduct || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ." })
    }

    // Find the document - there's only one document in your collection
    const document = await collection.findOne({})

    if (!document) {
      console.log("No document found in the collection")
      return res.status(404).json({ message: "Không tìm thấy dữ liệu." })
    }

    // Find the user in the users array
    const userIndex = document.users.findIndex((user) => String(user.id) === String(userId))

    if (userIndex === -1) {
      console.log(`User with ID ${userId} not found in document`)
      return res.status(404).json({ message: "Không tìm thấy người dùng với ID này." })
    }

    // Check if cart exists
    if (!document.users[userIndex].cart || document.users[userIndex].cart.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống." })
    }

    const cart = document.users[userIndex].cart

    // Find the product in the cart
    const productIndex = cart.findIndex((item) => String(item.idProduct) === String(idProduct))

    if (productIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng." })
    }

    // Update the quantity
    cart[productIndex].quantity = Number.parseInt(quantity, 10)

    // Update the document in MongoDB
    const result = await collection.updateOne({ _id: document._id }, { $set: { [`users.${userIndex}.cart`]: cart } })

    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      console.log("No document matched the query")
      return res.status(404).json({ message: "Không tìm thấy tài liệu để cập nhật." })
    }

    console.log(`Successfully updated product quantity for user ${userId}`)
    res.status(200).json({
      message: "Số lượng sản phẩm đã được cập nhật.",
      modifiedCount: result.modifiedCount,
      cart,
    })
  } catch (error) {
    console.error("Lỗi cập nhật số lượng sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server khi cập nhật số lượng sản phẩm.", error: error.message })
  }
}

export default updateCartHandler
