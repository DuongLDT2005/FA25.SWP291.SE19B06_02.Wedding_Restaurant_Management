import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://db_message:admin@nosqldb.h0qwvyr.mongodb.net/?retryWrites=true&w=majority&appName=NosqlDB";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false, // giữ mặc định an toàn
  tlsAllowInvalidHostnames: false,
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Kết nối MongoDB Atlas thành công!");
    const db = client.db("test");
    const collections = await db.listCollections().toArray();
    console.log("📂 Các collection trong 'test':", collections);
  } catch (err) {
    console.error("❌ Kết nối thất bại:", err);
  } finally {
    await client.close();
  }
}

run();
