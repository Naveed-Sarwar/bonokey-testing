import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { login } from "../../controller/Auth";

type Body = {
    username: string;
    password: string;
};

type Data = {
    error?: string;
};

const NextApi = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { username, password }: Body = JSON.parse(req.body);
    if (!username || !password) return res.status(400).json({ error: "Missing parameters" });
    const token = await login(username, password);
    if (token === null) return res.status(401).json({ error: "Invalid credentials" });
    res.setHeader("Set-Cookie", serialize("token", token, { path: "/" }))
        .status(200)
        .json({});
};

export default NextApi;
