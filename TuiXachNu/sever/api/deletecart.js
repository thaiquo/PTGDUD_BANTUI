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

const deleteCartHandler = async (req, res) => {
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
    const { idProduct } = req.body

    console.log(`Deleting from cart - userId: ${userId}, productId: ${idProduct}`)

    // Input validation
    if (!idProduct) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm." })
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

    // Filter out the product to be removed
    const updatedCart = cart.filter((item) => String(item.idProduct) !== String(idProduct))

    // If cart didn't change, product wasn't found
    if (updatedCart.length === cart.length) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng." })
    }

    // Update the document in MongoDB
    const result = await collection.updateOne(
      { _id: document._id },
      { $set: { [`users.${userIndex}.cart`]: updatedCart } },
    )

    console.log("Delete result:", result)

    if (result.matchedCount === 0) {
      console.log("No document matched the query")
      return res.status(404).json({ message: "Không tìm thấy tài liệu để cập nhật." })
    }

    console.log(`Successfully removed product from cart for user ${userId}`)
    res.status(200).json({
      message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
      modifiedCount: result.modifiedCount,
      cart: updatedCart,
    })
  } catch (error) {
    console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng.", error: error.message })
  }
}

export default deleteCartHandler
