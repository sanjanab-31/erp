import express from 'express';
import { getAllBooks, createBook, updateBook, deleteBook, getAllIssues, issueBook, returnBook, getLibrarySettings, updateLibrarySettings, getLibraryStats } from '../controllers/libraryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Books CRUD
router.get('/books', getAllBooks);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// Issues CRUD
router.get('/issues', getAllIssues);
router.post('/issues', issueBook);
router.put('/issues/:id/return', returnBook);

// Settings
router.get('/settings', getLibrarySettings);
router.put('/settings', updateLibrarySettings);
router.get('/stats', getLibraryStats);

export default router;
