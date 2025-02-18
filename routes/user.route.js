import { Router } from "express";
import { getUserProfile, socialLogin, SSOlogIn, userPassUp, userRegistration } from "../controller/user.control.js";
import authCheck from "../config/authCheck.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const router = Router();

// Configure rate limiter (e.g., 5 requests per 15 minutes per IP)
const rateLimiter = new RateLimiterMemory({
    points: 5,        // Number of allowed requests
    duration: 900,    // Time window in seconds (15 minutes)
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip); // Deduct a point for each request
        next(); // Proceed if within limits
    } catch {
       return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    }
};
// for all--> 
router.post('/user/regitration',rateLimiterMiddleware,userRegistration);
router.post('/user/regitration',rateLimiterMiddleware,SSOlogIn);

// AIthentic user ---> 
router.get('/user/profile',authCheck, getUserProfile);
router.get('/user/profile',authCheck, userPassUp);

// social logIn ---> 
router.post('/user/social-login',socialLogin);


export default router;