import { Router } from "express";
import { getUserProfile, socialLogin, SSOlogIn, userPassUp, userRegistration } from "../controller/user.control.js";

export const router = Router();

// for all--> 
router.post('/user/regitration',userRegistration);
router.post('/user/regitration',SSOlogIn);

// AIthentic user ---> 
router.get('/user/profile',getUserProfile);
router.get('/user/profile',userPassUp);

// social logIn ---> 
router.post('/user/social-login',socialLogin);


