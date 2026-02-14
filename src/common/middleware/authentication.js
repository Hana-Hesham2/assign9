// src/common/middleware/authentication.js
import { VerifyToken } from "../utils/token.service.js";

export const authentication = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Token is missing");
    }

    
    const token = authorization;

    const decoded = VerifyToken({ token, secret_key: "secretKey" });

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

   
    req.decoded = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
