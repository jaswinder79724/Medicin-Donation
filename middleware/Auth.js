const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;

const ensureAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // 1. Check header
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token required",
            success: false
        });
    }

    try {
        // 2. Extract token (Bearer <token>)
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format",
                success: false
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, key);

        // 4. Attach user
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Token expired or invalid",
            success: false
        });
    }
};

module.exports = ensureAuth;