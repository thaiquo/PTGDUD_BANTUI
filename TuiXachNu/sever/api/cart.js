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

const getCartHandler = async (req, res) => {
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
    console.log(`Fetching cart for user: ${userId}`)

    // Find the document - there's only one document in your collection
    const document = await collection.findOne({})

    if (!document) {
      console.log("No document found in the collection")
      return res.status(404).json({ message: "Không tìm thấy dữ liệu." })
    }

    // Find the user in the users array
    const user = document.users.find((user) => String(user.id) === String(userId))

    if (!user) {
      console.log(`User with ID ${userId} not found in document`)
      return res.status(404).json({ message: "Không tìm thấy người dùng với ID này." })
    }

    // Return the cart or an empty array if it doesn't exist
    const cart = user.cart || []
    console.log(`Found cart with ${cart.length} items for user ${userId}`)

    res.status(200).json({ cart })
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng.", error: error.message })
  }
}

export default getCartHandler
