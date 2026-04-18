import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import plotly.express as px
from flask import Flask, render_template, request, jsonify, url_for
import warnings
import os
import cv2
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
warnings.filterwarnings('ignore')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

class IntegratedMedicalSystem:
    def __init__(self):
        print("Loading datasets...")
        # Load datasets
        self.data = pd.read_csv('dataset.csv')
        self.severity_df = pd.read_csv('Symptom-severity.csv')
        self.description_df = pd.read_csv('symptom_Description.csv')
        self.precaution_df = pd.read_csv('symptom_precaution.csv')

        # Process symptoms
        self._process_symptoms()

        # Initialize models
        self.encoder = LabelEncoder()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.xray_model = load_model('respiratory_disease_model.h5')

        # X-ray diseases
        self.xray_diseases = {
            0: 'Pneumonia', 1: 'COVID-19', 2: 'Lung Cancer',
            3: 'Tuberculosis', 4: 'Cardiomegaly', 5: 'Emphysema',
            6: 'Edema', 7: 'Fibrosis'
        }

        # Train the model
        self._train_model()
        print("System initialized successfully!")

    def _process_symptoms(self):
        """Process and standardize symptoms from the dataset"""
        # Get all symptom columns
        symptom_cols = [col for col in self.data.columns if col.startswith('Symptom_')]

        # Collect all unique symptoms
        all_symptoms = set()
        for col in symptom_cols:
            symptoms = self.data[col].dropna().unique()
            all_symptoms.update([str(s).strip() for s in symptoms])

        # Remove any empty strings and sort
        self.symptoms = sorted(list(all_symptoms - {''}))
        
        # Create symptom severity mapping
        self.symptom_severities = dict(zip(
            self.severity_df['Symptom'],
            self.severity_df['weight']
        ))
        
        print(f"Total unique symptoms processed: {len(self.symptoms)}")

    def _train_model(self):
        """Train the symptom-based prediction model"""
        print("Training model...")

        # Create feature matrix
        X = np.zeros((len(self.data), len(self.symptoms)))

        # Fill feature matrix
        symptom_cols = [col for col in self.data.columns if col.startswith('Symptom_')]
        for idx, row in self.data.iterrows():
            for col in symptom_cols:
                if pd.notna(row[col]):
                    symptom = str(row[col]).strip()
                    if symptom in self.symptoms:
                        symptom_idx = self.symptoms.index(symptom)
                        X[idx, symptom_idx] = 1

        # Encode diseases
        y = self.encoder.fit_transform(self.data['Disease'])

        # Train model
        self.model.fit(X, y)
        print("Model training completed!")

    def predict_disease(self, symptoms):
        """Predict disease based on symptoms"""
        if not symptoms:
            return []

        # Create input features
        X = np.zeros((1, len(self.symptoms)))
        for symptom in symptoms:
            if symptom in self.symptoms:
                symptom_idx = self.symptoms.index(symptom)
                X[0, symptom_idx] = 1

        # Get predictions
        probabilities = self.model.predict_proba(X)[0]
        top_indices = probabilities.argsort()[-3:][::-1]

        results = []
        for idx in top_indices:
            disease = self.encoder.inverse_transform([idx])[0]
            confidence = probabilities[idx] * 100
            if confidence > 1:  # Only include predictions with >1% confidence
                results.append({
                    'disease': disease,
                    'confidence': confidence,
                    'needs_xray': disease in self.xray_diseases.values(),
                    'severity': self.get_disease_severity(disease),
                    'precautions': self.get_precautions(disease)
                })

        return results

    def get_disease_severity(self, disease):
        """Get overall severity for a disease based on its common symptoms"""
        disease_symptoms = self.data[self.data['Disease'] == disease].iloc[0]
        symptom_cols = [col for col in self.data.columns if col.startswith('Symptom_')]
        max_severity = 0
        for col in symptom_cols:
            if pd.notna(disease_symptoms[col]):
                severity = self.symptom_severities.get(disease_symptoms[col], 0)
                max_severity = max(max_severity, severity)
        return max_severity

    def get_precautions(self, disease):
        """Get precautions for a disease"""
        precautions = self.precaution_df[self.precaution_df['Disease'] == disease]
        if not precautions.empty:
            return [p for p in [
                precautions['Precaution_1'].iloc[0],
                precautions['Precaution_2'].iloc[0],
                precautions['Precaution_3'].iloc[0],
                precautions['Precaution_4'].iloc[0]
            ] if pd.notna(p)]
        return []

system = IntegratedMedicalSystem()

@app.route('/')
def home():
    return render_template('index.html', 
                         symptoms=system.symptoms,
                         severities=system.symptom_severities)

@app.route('/predict', methods=['POST'])
def predict():
    symptoms = request.json.get('symptoms', [])
    predictions = system.predict_disease(symptoms)
    return jsonify(predictions)

@app.route('/upload_xray', methods=['POST'])
def upload_xray():
    if 'xray' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['xray']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Load and preprocess the image
        image = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        image = cv2.resize(image, (28, 28))
        image = image / 255.0
        image = np.expand_dims(image, axis=-1)
        image = np.expand_dims(image, axis=0)

        # Make prediction
        predictions = system.xray_model.predict(image)
        label_idx = np.argmax(predictions)
        confidence = predictions[0][label_idx]

        # Return the prediction results
        return jsonify({
            'confidence': float(confidence),  # Convert to native Python float
            'image_url': url_for('static', filename=f'uploads/{filename}') 
        })

if __name__ == '__main__':
    app.run(debug=True)