import os
from typing import Dict, Tuple, Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBClassifier

TARGET_COLUMN = "Is_Fraudulent"
MODEL_PATH = "fraud_model.pkl"
RANDOM_STATE = 42


# -----------------------------
# Utility helpers
# -----------------------------
def _resolve_dataset_path(primary_name: str, fallback_name: str) -> str:
    if os.path.exists(primary_name):
        return primary_name
    if os.path.exists(fallback_name):
        return fallback_name
    raise FileNotFoundError(
        f"Dataset not found. Tried '{primary_name}' and '{fallback_name}'."
    )


def _normalize_boolean_like(value: Any) -> Any:
    if pd.isna(value):
        return value
    normalized = str(value).strip().upper()
    if normalized in {"TRUE", "T", "YES", "Y", "1"}:
        return 1
    if normalized in {"FALSE", "F", "NO", "N", "0"}:
        return 0
    return value


def _coerce_booleans_in_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    processed = df.copy()
    for column in processed.columns:
        if processed[column].dtype == object:
            converted = processed[column].map(_normalize_boolean_like)
            if converted.dropna().isin([0, 1]).all() and converted.notna().sum() > 0:
                processed[column] = pd.to_numeric(converted, errors="coerce")
            else:
                processed[column] = converted
    return processed


# -----------------------------
# Required modular functions
# -----------------------------
def load_data(
    train_path: str = "train_claims.csv",
    test_path: str = "test_claims.csv",
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load train and test datasets.

    Supports default names from requirement and existing workspace fallback names.
    """
    resolved_train = _resolve_dataset_path(train_path, "training_data.csv")
    resolved_test = _resolve_dataset_path(test_path, "testting_data.csv")

    train_df = pd.read_csv(resolved_train)
    test_df = pd.read_csv(resolved_test)

    if TARGET_COLUMN not in train_df.columns or TARGET_COLUMN not in test_df.columns:
        raise ValueError(f"Both datasets must contain target column '{TARGET_COLUMN}'.")

    return train_df, test_df


def preprocess_data(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, ColumnTransformer]:
    """Preprocess data and ensure train/test feature compatibility.

    - Converts TRUE/FALSE style values to 1/0
    - Aligns train/test feature columns
    - Builds sklearn preprocessor (imputation + encoding + scaling)
    """
    train = _coerce_booleans_in_dataframe(train_df)
    test = _coerce_booleans_in_dataframe(test_df)

    # Convert target TRUE/FALSE to 1/0 robustly
    train[TARGET_COLUMN] = train[TARGET_COLUMN].map(_normalize_boolean_like)
    test[TARGET_COLUMN] = test[TARGET_COLUMN].map(_normalize_boolean_like)

    train[TARGET_COLUMN] = pd.to_numeric(train[TARGET_COLUMN], errors="coerce").fillna(0).astype(int)
    test[TARGET_COLUMN] = pd.to_numeric(test[TARGET_COLUMN], errors="coerce").fillna(0).astype(int)

    y_train = train[TARGET_COLUMN]
    y_test = test[TARGET_COLUMN]

    X_train = train.drop(columns=[TARGET_COLUMN])
    X_test = test.drop(columns=[TARGET_COLUMN])

    # Ensure same feature structure in train and test
    X_train, X_test = X_train.align(X_test, join="outer", axis=1)

    # Infer feature types
    numeric_cols = X_train.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [col for col in X_train.columns if col not in numeric_cols]

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numeric_cols),
            ("cat", categorical_pipeline, categorical_cols),
        ]
    )

    return X_train, y_train, X_test, y_test, preprocessor


def train_model(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    preprocessor: ColumnTransformer,
) -> Dict[str, Pipeline]:
    """Train XGBoost, Random Forest, and Logistic Regression models."""
    models: Dict[str, Pipeline] = {
        "XGBoost": Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                (
                    "classifier",
                    XGBClassifier(
                        n_estimators=250,
                        max_depth=6,
                        learning_rate=0.05,
                        subsample=0.9,
                        colsample_bytree=0.9,
                        random_state=RANDOM_STATE,
                        eval_metric="logloss",
                    ),
                ),
            ]
        ),
        "RandomForest": Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                (
                    "classifier",
                    RandomForestClassifier(
                        n_estimators=300,
                        max_depth=None,
                        random_state=RANDOM_STATE,
                        n_jobs=-1,
                    ),
                ),
            ]
        ),
        "LogisticRegression": Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                (
                    "classifier",
                    LogisticRegression(
                        max_iter=2000,
                        random_state=RANDOM_STATE,
                    ),
                ),
            ]
        ),
    }

    for model_name, model in models.items():
        print(f"Training {model_name}...")
        model.fit(X_train, y_train)

    return models


def evaluate_model(
    models: Dict[str, Pipeline],
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> Tuple[str, Pipeline, Dict[str, Dict[str, Any]]]:
    """Evaluate all models and auto-select best by F1, tie-breaker ROC-AUC."""
    metrics_by_model: Dict[str, Dict[str, Any]] = {}

    for model_name, model in models.items():
        y_pred = model.predict(X_test)

        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test)[:, 1]
        else:
            # Fallback for models without predict_proba
            raw_scores = model.decision_function(X_test)
            y_prob = (raw_scores - raw_scores.min()) / (raw_scores.max() - raw_scores.min() + 1e-9)

        model_metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred, zero_division=0),
            "recall": recall_score(y_test, y_pred, zero_division=0),
            "f1": f1_score(y_test, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y_test, y_prob),
            "confusion_matrix": confusion_matrix(y_test, y_pred),
        }
        metrics_by_model[model_name] = model_metrics

        print(f"\n=== {model_name} ===")
        print(f"Accuracy:  {model_metrics['accuracy']:.4f}")
        print(f"Precision: {model_metrics['precision']:.4f}")
        print(f"Recall:    {model_metrics['recall']:.4f}")
        print(f"F1 Score:  {model_metrics['f1']:.4f}")
        print(f"ROC-AUC:   {model_metrics['roc_auc']:.4f}")
        print("Confusion Matrix:")
        print(model_metrics["confusion_matrix"])

    best_model_name, best_metrics = max(
        metrics_by_model.items(),
        key=lambda kv: (kv[1]["f1"], kv[1]["roc_auc"]),
    )
    best_model = models[best_model_name]

    print(f"\nBest model selected: {best_model_name}")
    print(
        f"Selection basis -> F1: {best_metrics['f1']:.4f}, "
        f"ROC-AUC: {best_metrics['roc_auc']:.4f}"
    )

    return best_model_name, best_model, metrics_by_model


def save_model(model: Pipeline, file_path: str = MODEL_PATH) -> None:
    """Save trained model pipeline to disk."""
    joblib.dump(model, file_path)
    print(f"Saved model to: {file_path}")


def predict(
    new_claim_data: pd.DataFrame | Dict[str, Any],
    model_path: str = MODEL_PATH,
) -> Dict[str, Any]:
    """Predict fraud label and probability for new claim data.

    Returns:
    {
        "prediction": "TRUE" | "FALSE",
        "probability": float
    }
    """
    model: Pipeline = joblib.load(model_path)

    if isinstance(new_claim_data, dict):
        input_df = pd.DataFrame([new_claim_data])
    else:
        input_df = new_claim_data.copy()

    input_df = _coerce_booleans_in_dataframe(input_df)
    y_prob = model.predict_proba(input_df)[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)

    return {
        "prediction": "TRUE" if int(y_pred[0]) == 1 else "FALSE",
        "probability": float(y_prob[0]),
    }


# -----------------------------
# Feature importance
# -----------------------------
def _get_transformed_feature_names(model: Pipeline) -> np.ndarray:
    preprocessor: ColumnTransformer = model.named_steps["preprocessor"]
    return preprocessor.get_feature_names_out()


def print_feature_importance(model: Pipeline, top_n: int = 20) -> None:
    """Print top feature importances/coefs for model explainability."""
    classifier = model.named_steps["classifier"]
    feature_names = _get_transformed_feature_names(model)

    if hasattr(classifier, "feature_importances_"):
        scores = classifier.feature_importances_
    elif hasattr(classifier, "coef_"):
        scores = np.abs(classifier.coef_).ravel()
    else:
        print("Feature importance is not available for this model.")
        return

    sorted_idx = np.argsort(scores)[::-1][:top_n]
    print(f"\nTop {top_n} important features:")
    for rank, idx in enumerate(sorted_idx, start=1):
        print(f"{rank:02d}. {feature_names[idx]} -> {scores[idx]:.6f}")


# -----------------------------
# End-to-end runner
# -----------------------------
def main() -> None:
    train_df, test_df = load_data()
    X_train, y_train, X_test, y_test, preprocessor = preprocess_data(train_df, test_df)

    models = train_model(X_train, y_train, preprocessor)
    best_model_name, best_model, _ = evaluate_model(models, X_test, y_test)

    print_feature_importance(best_model, top_n=20)
    save_model(best_model, MODEL_PATH)

    print(f"\nTraining complete. Best model: {best_model_name}")
    print(f"Model artifact: {MODEL_PATH}")


if __name__ == "__main__":
    main()
