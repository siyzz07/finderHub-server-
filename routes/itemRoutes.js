import express from 'express';
import { getItems, getItemById, createItem, approveItem, getMyItems, deleteItem, updateItemStatus, getAdminStats } from '../controllers/itemController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getItems);
router.get('/my-items', authMiddleware, getMyItems);
router.get('/:id', getItemById);
router.post('/', authMiddleware, createItem);
router.patch('/:id/approve', authMiddleware, adminMiddleware, approveItem);
router.patch('/:id/status', authMiddleware, updateItemStatus);
router.get('/admin/stats', authMiddleware, adminMiddleware, getAdminStats);
router.delete('/:id', authMiddleware, adminMiddleware, deleteItem);

// New image upload route
router.post('/upload', authMiddleware, upload.array('images', 3), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => file.path);
    res.json({ imageUrls });
});

export default router;
