import pandas as pd

df_donor = pd.read_csv('machine_learning/data/raw/data_donor.csv')
df_receiver = pd.read_csv('machine_learning/data/raw/data_penerima.csv')

def find_min_max(df):
    numeric_cols = df.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        print(f"Kolom: {col}")
        print(f"Nilai minimum: {df[col].min()}")
        print(f"Nilai maksimum: {df[col].max()}")
        print("-" * 20)

print("Dataset Donor:")
find_min_max(df_donor)

print("\nDataset Penerima:")
find_min_max(df_receiver)