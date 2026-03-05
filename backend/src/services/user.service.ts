import { RowDataPacket } from "mysql2";
import { db } from "../config/db.js";

type UserRow = RowDataPacket & {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
};

export type UserProfile = {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
};

export class UserService {
    async getUserById(id: number): Promise<UserProfile | null> {
        const [rows] = await db.query<UserRow[]>(
            "SELECT id, user_name, last_name, email FROM users WHERE id = ? LIMIT 1",
            [id]
        );
        const user = Array.isArray(rows) ? rows[0] : null;
        if (!user) return null;
        return {
            id: user.id,
            user_name: user.user_name,
            last_name: user.last_name,
            email: user.email,
        };
    }
}
