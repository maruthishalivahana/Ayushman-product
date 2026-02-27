import path from 'path';
import { spawn } from 'child_process';
import { FraudModelInstance } from './extractionService';

export type FraudPredictionResult = {
    prediction: 'TRUE' | 'FALSE';
    probability: number;
};

const resolveMachineScriptPath = (): string => {
    return process.env.ML_PREDICT_SCRIPT_PATH
        ? path.resolve(process.env.ML_PREDICT_SCRIPT_PATH)
        : path.resolve(__dirname, '../../../machine/predict_api.py');
};

const resolvePythonCommand = (): string => {
    return process.env.PYTHON_BIN || 'python';
};

export const predictFraud = async (instance: FraudModelInstance): Promise<FraudPredictionResult> => {
    const scriptPath = resolveMachineScriptPath();
    const pythonCommand = resolvePythonCommand();

    return new Promise((resolve, reject) => {
        const child = spawn(pythonCommand, [scriptPath], {
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
            } catch (error: any) {
                reject(new Error(`Failed to parse ML output: ${error?.message || 'unknown parse error'}`));
            }
        });

        child.stdin.write(JSON.stringify({ instance }));
        child.stdin.end();
    });
};
