"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const claimController_1 = require("../controllers/claimController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
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
router.post('/process', upload.single('pdf'), claimController_1.processClaim);
router.post('/process-model', upload.single('pdf'), claimController_1.processClaimForModel);
router.post('/validate-pdf', upload.single('pdf'), claimController_1.validatePdfUpload);
router.post('/validate-and-parse', upload.single('pdf'), claimController_1.validateAndParsePdf);
router.get('/', claimController_1.getAllClaims);
exports.default = router;
