import { User } from "@/generated/prisma";
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = User[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const users = await db.user.findMany();
    res.status(200).json(users);
}
