export default class AddNewStoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.cameraBlob = null;
  }

  setCameraBlob(blob) {
    this.cameraBlob = blob;
  }

  async submitForm({ content, file, latitude, longitude }) {
    if (!latitude || !longitude) return this.view.showError("Silakan pilih lokasi di peta terlebih dahulu.");
    if (!file && !this.cameraBlob) return this.view.showError("Silakan pilih file atau ambil foto dari kamera.");

    const formData = new FormData();
    formData.append("description", content);
    formData.append("lat", latitude);
    formData.append("lon", longitude);

    if (file) {
      formData.append("photo", file);
    } else {
      const cameraFile = new File([this.cameraBlob], "camera-photo.jpg", {
        type: "image/jpeg",
      });
      formData.append("photo", cameraFile);
    }

    try {
      await this.model.submitStory(formData);
      this.view.showSuccess();
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}
