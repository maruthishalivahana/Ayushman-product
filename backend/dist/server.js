"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const claimRoutes_1 = __importDefault(require("./routes/claimRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect Database
(0, db_1.default)();
app.use(express_1.default.json());
// Routes
app.use('/api/claims', claimRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Healthcare claim processing backend is running.');
});
app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
