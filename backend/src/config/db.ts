import mysql from 'mysql2/promise'
import { env } from './env.js'

export const db = mysql.createPool({
    uri: env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
});