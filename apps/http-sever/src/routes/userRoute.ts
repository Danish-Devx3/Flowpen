import { Router } from "express";
import { getUserRooms, userSignin, userSignup } from "../controllers/authController/user";
import { middleware } from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/user/rooms", middleware, getUserRooms)



export default router;