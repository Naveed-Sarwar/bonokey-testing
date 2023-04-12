import jwt from "jsonwebtoken";
import argon2 from "argon2";

const login = async (username, password) => {
    if (username.toLowerCase() === process.env.USER && (await argon2.verify(Buffer.from(process.env.PASSWORD, "hex").toString(), password)))
        return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return null;
};

const verify = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return null;
    }
};

export { login, verify };
