import express from 'express';
import { generateBlogContent } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateBlogContent);

export default router;
