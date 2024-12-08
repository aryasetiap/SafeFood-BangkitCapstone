import requests

def get_predictions_from_model(encoded_data):
    """Mengirim data ke model di Google Cloud dan mengembalikan hasil prediksi."""
    model_endpoint = "https://<google-cloud-model-endpoint>"
    headers = {"Content-Type": "application/json"}
    response = requests.post(model_endpoint, headers=headers, json={"instances": encoded_data})

    if response.status_code == 200:
        return response.json()["predictions"]
    else:
        raise Exception(f"Error from model: {response.text}")
