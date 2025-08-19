import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your jwt secret is here'

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, msg: "Not authorized, token missing" })
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(payload.id).select("_id name email")
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" })
        }

        // yahan hum sirf id save karenge
        req.user = { id: user._id }

        next()
    } catch (error) {
        console.log("jwt verification failed", error.message)
        return res.status(401).json({ success: false, msg: "Token invalid" })
    }
}
