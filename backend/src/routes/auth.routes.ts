import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Sign up route
router.post('/signup', authController.signup);

// Sign in route
router.post('/signin', authController.signin);

export default router;

