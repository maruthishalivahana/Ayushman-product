import json
import sys
from typing import Any, Dict

import numpy as np
import pandas as pd

from fraud_detection import MODEL_PATH, _coerce_booleans_in_dataframe
import joblib


def _ensure_all_required_columns(model: Any, input_df: pd.DataFrame) -> pd.DataFrame:
    preprocessor = model.named_steps["preprocessor"]
    required_columns = list(preprocessor.feature_names_in_)

    prepared = input_df.copy()
    for column in required_columns:
        if column not in prepared.columns:
            prepared[column] = np.nan

    prepared = prepared[required_columns]
    return prepared


def _predict_from_instance(instance: Dict[str, Any]) -> Dict[str, Any]:
    model = joblib.load(MODEL_PATH)

    input_df = pd.DataFrame([instance])
    input_df = _coerce_booleans_in_dataframe(input_df)
    input_df = _ensure_all_required_columns(model, input_df)

    probabilities = model.predict_proba(input_df)[:, 1]
    probability = float(probabilities[0])
    prediction = "TRUE" if probability >= 0.5 else "FALSE"

    return {
        "prediction": prediction,
        "probability": probability,
    }


def main() -> None:
    raw = sys.stdin.read().strip()
    if not raw:
        raise ValueError("Empty input payload")

    payload = json.loads(raw)
    instance = payload.get("instance")
    if not isinstance(instance, dict):
        raise ValueError("Payload must include 'instance' object")

    result = _predict_from_instance(instance)
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        sys.stderr.write(str(error))
        sys.exit(1)
