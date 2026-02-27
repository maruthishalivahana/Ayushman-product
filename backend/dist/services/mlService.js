"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictFraud = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const resolveMachineScriptPath = () => {
    return process.env.ML_PREDICT_SCRIPT_PATH
        ? path_1.default.resolve(process.env.ML_PREDICT_SCRIPT_PATH)
        : path_1.default.resolve(__dirname, '../../../machine/predict_api.py');
};
const resolvePythonCommand = () => {
    return process.env.PYTHON_BIN || 'python';
};
const predictFraud = async (instance) => {
    const scriptPath = resolveMachineScriptPath();
    const pythonCommand = resolvePythonCommand();
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(pythonCommand, [scriptPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (chunk) => {
            stdout += String(chunk);
        });
        child.stderr.on('data', (chunk) => {
            stderr += String(chunk);
        });
        child.on('error', (error) => {
            reject(new Error(`Failed to start ML process: ${error.message}`));
        });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`ML process exited with code ${code}: ${stderr || 'unknown error'}`));
                return;
            }
            try {
                const parsed = JSON.parse(stdout.trim());
                if (!parsed || (parsed.prediction !== 'TRUE' && parsed.prediction !== 'FALSE')) {
                    throw new Error('Invalid prediction payload from ML service');
                }
                const probability = Number(parsed.probability);
                if (!Number.isFinite(probability)) {
                    throw new Error('Invalid probability from ML service');
                }
                resolve({
                    prediction: parsed.prediction,
                    probability
                });
            }
            catch (error) {
                reject(new Error(`Failed to parse ML output: ${error?.message || 'unknown parse error'}`));
            }
        });
        child.stdin.write(JSON.stringify({ instance }));
        child.stdin.end();
    });
};
exports.predictFraud = predictFraud;
