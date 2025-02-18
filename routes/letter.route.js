import { Router } from "express";
import {
  addALikeInLetter,
  createLetter,
  deleteLetter,
  getLetter,
} from "../controller/letter.control.js";
import authCheck from "../config/authCheck.js";

const router = Router();

router.post("/letter/create", createLetter);
router.post("/letter/like/:letterId/controll", authCheck, addALikeInLetter);
router.get("/letter/get/:letterId", authCheck, getLetter);
router.get("/letter/get/user/:userId/letters", authCheck, getLetter);
router.delete("/letter/:letterId/delete", authCheck, deleteLetter);

export default router;
