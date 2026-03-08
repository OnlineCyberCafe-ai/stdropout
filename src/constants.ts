export interface StudentData {
  id: string;
  gender: 'Male' | 'Female';
  age: number;
  familyIncome: 'Low' | 'Medium' | 'High';
  parentsEducation: 'Primary' | 'Secondary' | 'Higher';
  attendance: number;
  previousMarks: number;
  backlogs: number;
  participation: 'Low' | 'Medium' | 'High';
  internetAccess: boolean;
  studyHours: number;
  distance: number;
  dropout: boolean;
}

export const SAMPLE_DATA: StudentData[] = [
  { id: 'S001', gender: 'Male', age: 20, familyIncome: 'Low', parentsEducation: 'Primary', attendance: 65, previousMarks: 55, backlogs: 3, participation: 'Low', internetAccess: false, studyHours: 2, distance: 15, dropout: true },
  { id: 'S002', gender: 'Female', age: 19, familyIncome: 'High', parentsEducation: 'Higher', attendance: 95, previousMarks: 88, backlogs: 0, participation: 'High', internetAccess: true, studyHours: 6, distance: 2, dropout: false },
  { id: 'S003', gender: 'Male', age: 21, familyIncome: 'Medium', parentsEducation: 'Secondary', attendance: 80, previousMarks: 72, backlogs: 1, participation: 'Medium', internetAccess: true, studyHours: 4, distance: 5, dropout: false },
  { id: 'S004', gender: 'Female', age: 22, familyIncome: 'Low', parentsEducation: 'Secondary', attendance: 40, previousMarks: 45, backlogs: 5, participation: 'Low', internetAccess: false, studyHours: 1, distance: 20, dropout: true },
  { id: 'S005', gender: 'Male', age: 20, familyIncome: 'Medium', parentsEducation: 'Higher', attendance: 88, previousMarks: 78, backlogs: 0, participation: 'High', internetAccess: true, studyHours: 5, distance: 3, dropout: false },
  { id: 'S006', gender: 'Female', age: 19, familyIncome: 'Low', parentsEducation: 'Primary', attendance: 70, previousMarks: 60, backlogs: 2, participation: 'Medium', internetAccess: true, studyHours: 3, distance: 10, dropout: false },
  { id: 'S007', gender: 'Male', age: 23, familyIncome: 'High', parentsEducation: 'Higher', attendance: 92, previousMarks: 85, backlogs: 0, participation: 'High', internetAccess: true, studyHours: 7, distance: 1, dropout: false },
  { id: 'S008', gender: 'Female', age: 20, familyIncome: 'Medium', parentsEducation: 'Secondary', attendance: 55, previousMarks: 50, backlogs: 4, participation: 'Low', internetAccess: false, studyHours: 2, distance: 12, dropout: true },
];

export const PYTHON_GUIDE = `
# Educational Data Mining: Student Dropout Prediction

This guide provides the complete workflow and Python code for predicting student dropouts.

## 1. Project Workflow
1. **Data Collection**: Gathering academic, demographic, and behavioral data.
2. **Exploratory Data Analysis (EDA)**: Visualizing distributions and correlations.
3. **Data Preprocessing**: Handling missing values, encoding categorical variables, and scaling.
4. **Feature Selection**: Identifying the most impactful predictors.
5. **Model Training**: Training multiple classifiers (Random Forest, Logistic Regression, etc.).
6. **Evaluation**: Comparing models using metrics like Accuracy, F1-Score, and Confusion Matrix.
7. **Deployment**: Creating an interface for real-time predictions.

## 2. Python Implementation

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_material, accuracy_score

# 1. Load Dataset
# df = pd.read_csv('student_data.csv')

# Sample Data Creation for Demo
data = {
    'Gender': ['M', 'F', 'M', 'F', 'M', 'F', 'M', 'F'],
    'Age': [20, 19, 21, 22, 20, 19, 23, 20],
    'Attendance': [65, 95, 80, 40, 88, 70, 92, 55],
    'Marks': [55, 88, 72, 45, 78, 60, 85, 50],
    'Backlogs': [3, 0, 1, 5, 0, 2, 0, 4],
    'Dropout': ['Yes', 'No', 'No', 'Yes', 'No', 'No', 'No', 'Yes']
}
df = pd.DataFrame(data)

# 2. Preprocessing
le = LabelEncoder()
df['Gender'] = le.fit_transform(df['Gender'])
df['Dropout'] = le.fit_transform(df['Dropout'])

X = df.drop('Dropout', axis=1)
y = df['Dropout']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Training
models = {
    "Logistic Regression": LogisticRegression(),
    "Random Forest": RandomForestClassifier(n_estimators=100)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"--- {name} ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
    print(classification_report(y_test, y_pred))

# 4. Visualization
plt.figure(figsize=(10, 6))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title("Feature Correlation Matrix")
plt.show()
\`\`\`

## 3. Improving Performance
- **Feature Engineering**: Create new features like 'Attendance-to-Marks' ratio.
- **Hyperparameter Tuning**: Use GridSearchCV to find optimal parameters for Random Forest.
- **Handling Imbalance**: Use SMOTE if the number of dropouts is much smaller than non-dropouts.
- **Ensemble Methods**: Try XGBoost or LightGBM for better accuracy.
`;
