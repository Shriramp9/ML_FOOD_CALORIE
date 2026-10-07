from huggingface_hub import snapshot_download

dataset_path = snapshot_download(
    repo_id="SohlHealth/sohl-multidish-yolo-dataset",
    repo_type="dataset",
    local_dir="dataset"
)
print(f"Dataset downloaded to {dataset_path}")
