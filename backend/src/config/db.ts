import mysql from 'mysql2/promise'
import { env } from './env'

export const db = mysql.createPool({
    uri: env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
});