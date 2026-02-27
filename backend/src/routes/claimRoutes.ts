import express from 'express';
import multer from 'multer';
import { processClaim, processClaimForModel, getAllClaims, validatePdfUpload, validateAndParsePdf } from '../controllers/claimController';

const router = express.Router();
const upload = multer({
	dest: 'uploads/',
	fileFilter: (_req, file, cb) => {
		const isPdf = file.mimetype === 'application/pdf';
		const isImage = file.mimetype.startsWith('image/');
		if (!isPdf && !isImage) {
			cb(new Error('Only PDF or image files are allowed'));
			return;
		}
		cb(null, true);
	}
});

router.post('/process', upload.single('pdf'), processClaim);
router.post('/process-model', upload.single('pdf'), processClaimForModel);
router.post('/validate-pdf', upload.single('pdf'), validatePdfUpload);
router.post('/validate-and-parse', upload.single('pdf'), validateAndParsePdf);
router.get('/', getAllClaims);

export default router;
