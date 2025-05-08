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

const register = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { username, email, password, roles } = req.body

  try {
    if (!cachedClient) {
      await client.connect()
      cachedClient = client
      console.log("✅ Connected to MongoDB")
    }

    const db = cachedClient.db("Tuixach")
    const collection = db.collection("data")

    const document = await collection.findOne({})
    if (!document) {
      return res.status(500).json({ error: "Không tìm thấy document chính" })
    }

    const existingUser = document.users?.find((user) => user.username === username)
    if (existingUser) {
      return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" })
    }

    // Tạo ID mới cho người dùng
    const maxId = Math.max(...document.users.map((user) => Number(user.id) || 0), 0)
    const newUserId = String(maxId + 1)

    // Thêm trường cart và order rỗng khi tạo người dùng mới
    const newUser = {
      id: newUserId,
      username,
      email,
      password,
      roles,
      cart: [], // Thêm mảng giỏ hàng rỗng
      order: [], // Thêm mảng đơn hàng rỗng (sử dụng "order" thay vì "orders")
    }

    await collection.updateOne({ _id: document._id }, { $push: { users: newUser } })

    console.log(`✅ Đã đăng ký người dùng mới: ${username} với ID: ${newUserId}`)
    return res.status(200).json({ message: "Đăng ký thành công" })
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err)
    return res.status(500).json({ error: "Lỗi ghi dữ liệu MongoDB" })
  }
}

export default register
