import express from 'express';
import {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    getAllIssues,
    issueBook,
    returnBook,
    getLibraryStats,
    getLibrarySettings,
    updateLibrarySettings
} from '../controllers/libraryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/books', getAllBooks);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('/issues', getAllIssues);
router.post('/issues', issueBook);
router.put('/issues/:id/return', returnBook);

router.get('/stats', getLibraryStats);

router.get('/settings', getLibrarySettings);
router.put('/settings', updateLibrarySettings);

export default router;
