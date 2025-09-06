import {Router} from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1,
        }
    ]),
    // before registerUser creating another middleware to check for avatar and coverImg
    registerUser);

router.route("/login").post(loginUser);

// Secured routes
// logout is a method, we want to use our middlware before executing this method
// using our custom middlware verifyJWT before logoutUser
router.route("/logout").post( verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router;