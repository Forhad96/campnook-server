import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.vavlidation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";

const router = Router()


router.post("/login",validateRequest(AuthValidation.loginValidationSchema),AuthControllers.handleLoginUser)

router.post('/change-password',auth(USER_ROLES.admin,USER_ROLES.student,USER_ROLES.faculty) ,validateRequest(AuthValidation.changePasswordValidationSchema),AuthControllers.handleChangePassword)

router.post("/refresh-token",validateRequest(AuthValidation.refreshTokenValidationSchema),AuthControllers.handleRefreshToken)
router.post("/forgot-password",validateRequest(AuthValidation.forgotPasswordValidationSchema),AuthControllers.handleForgotPassword)
router.post("/reset-password",validateRequest(AuthValidation.resetPasswordValidationSchema),AuthControllers.handleResetPassword)
router.get("/")




export const AuthRoutes = router