import express from 'express';
import { getMe } from '../controllers/auth.controller.js';
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateProfile,
    updateUser,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    createUserSchema,
    updateProfileSchema,
    updateUserSchema,
} from '../validations/user.validation.js';

const router = express.Router();

// Protected routes
router.get('/profile', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

// Admin routes
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getUsers);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getUser);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createUserSchema), createUser);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteUser);

export default router;

