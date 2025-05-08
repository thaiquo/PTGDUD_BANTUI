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

const addToCartHandler = async (req, res) => {
  try {
    // Connect to MongoDB if not already connected
    if (!cachedClient) {
      await client.connect()
      cachedClient = client
      console.log("✅ Connected to MongoDB")
    }

    const db = cachedClient.db("Tuixach") // Matches your other handlers
    const collection = db.collection("data")

    const userId = req.params.userId
    const { idProduct, quantity } = req.body

    console.log(`Adding to cart - userId: ${userId}, productId: ${idProduct}, quantity: ${quantity}`)

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

    console.log(`Found user at index ${userIndex}`)

    // Initialize cart if it doesn't exist
    if (!document.users[userIndex].cart) {
      document.users[userIndex].cart = []
    }

    const cart = document.users[userIndex].cart

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item) => String(item.idProduct) === String(idProduct))

    if (existingItemIndex !== -1) {
      // Update quantity if product exists
      console.log(`Updating quantity for existing product ${idProduct} to ${quantity}`)
      cart[existingItemIndex].quantity = Number.parseInt(quantity, 10)
    } else {
      // Add new product to cart
      const maxId = cart.length > 0 ? Math.max(...cart.map((item) => Number.parseInt(item.id, 10))) : 0
      const newItem = {
        id: maxId + 1,
        idProduct: idProduct,
        quantity: Number.parseInt(quantity, 10),
      }
      console.log(`Adding new product to cart:`, newItem)
      cart.push(newItem)
    }

    // Update the document in MongoDB
    const result = await collection.updateOne({ _id: document._id }, { $set: { [`users.${userIndex}.cart`]: cart } })

    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      console.log("No document matched the query")
      return res.status(404).json({ message: "Không tìm thấy tài liệu để cập nhật." })
    }

    console.log(`Successfully updated cart for user ${userId}`)
    res.status(200).json({
      message: "Sản phẩm đã được thêm vào giỏ hàng.",
      modifiedCount: result.modifiedCount,
      cart,
    })
  } catch (error) {
    console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm vào giỏ hàng.", error: error.message })
  }
}

export default addToCartHandler
