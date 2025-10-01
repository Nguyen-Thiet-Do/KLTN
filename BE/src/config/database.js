const mysql = require('mysql2/promise');

require('dotenv').config(); // Load environment variables from .env file


const databaseConnection = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
    queueLimit: 0


});
(async () => {
    try {
        const conn = await databaseConnection.getConnection();
        await conn.ping();
        conn.release();
        console.log('✅ Kết nối MySQL thành công');
    } catch (e) {
        console.error('❌ Lỗi kết nối MySQL:', e.message);
    }
})();

module.exports = databaseConnection;