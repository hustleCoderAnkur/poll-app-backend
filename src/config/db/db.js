import pg from "pg"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/node-postgres"

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool)

export const connectDB = async () => {
    try {
        const client = await pool.connect()
        console.log("PostgreSQL Connected")
        client.release()
    } catch (error) {
        console.log(error.message)
    }
}


