import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.vavlidation";
import { AuthControllers } from "./auth.controller";

const router = Router()


router.post("/login",validateRequest(AuthValidation.loginValidationSchema),AuthControllers.handleLoginUser)

router.post('/change-password',validateRequest(AuthValidation.changePasswordValidationSchema),AuthControllers.handleChangePassword)

router.post("/refresh-token",validateRequest(AuthValidation.refreshTokenValidationSchema),AuthControllers.handleRefreshToken)
router.post("/forgot-password",validateRequest(AuthValidation.forgotPasswordValidationSchema),AuthControllers.handleForgotPassword)
router.post("/reset-password",validateRequest(AuthValidation.resetPasswordValidationSchema),AuthControllers.handleResetPassword)





export const AuthRoutes = router