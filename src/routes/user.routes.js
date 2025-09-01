import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middlewares.js'
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

export default router;