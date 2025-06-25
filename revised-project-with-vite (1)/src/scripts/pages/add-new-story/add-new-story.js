import AddNewStoryModel from "./add-new-story-model.js";
import AddNewStoryPresenter from "./add-new-story-presenter.js";
import { sendStoryNotification } from "../../push-notification.js";

export default class AddNewStoryPage {
  constructor() {
    this.presenter = new AddNewStoryPresenter(this, AddNewStoryModel); // Inject model ke presenter
  }

  async render() {
    return `
    <section class="story-form-container">
      <h1>Add New Story</h1>
      <form id="add-story-form">
        <label for="content">Description</label>
        <textarea id="content" name="content" rows="3" required></textarea>

        <label for="image">Photo</label>
        <input type="file" id="image" name="image" accept="image/*" />

        <label for="capture">Capture with Camera:</label>
        <div class="camera-wrapper">
          <video id="video" width="100%" height="240" autoplay></video>
          <div class="camera-buttons">
            <button type="button" id="start-camera" aria-label="Start Camera">Start Camera</button>
            <button type="button" id="take-photo" aria-label="Take Photo">Take Photo</button>
            <button type="button" id="stop-camera" aria-label="Stop Camera">Stop Camera</button>
          </div>
          <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
          <img id="photo-preview" alt="Preview" style="margin-top: 10px; max-width: 100%; display: none;" />
        </div>

        <label for="location">Pick Location:</label>
        <div id="map" style="width: 100%; height: 300px; border-radius: 12px; margin-bottom: 20px;"></div>
        <input type="hidden" id="latitude" name="latitude">
        <input type="hidden" id="longitude" name="longitude">

        <button type="submit">Add Story</button>
      </form>
    </section>
    `;
  }

  async afterRender() {
    this.setupCamera();
    this.setupMap();

    document
      .getElementById("add-story-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.presenter.submitForm({
          content: document.getElementById("content").value,
          file: document.getElementById("image").files[0],
          latitude: document.getElementById("latitude").value,
          longitude: document.getElementById("longitude").value,
        });
      });
  }

  setupCamera() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("photo-preview");
    let stream;

    document
      .getElementById("start-camera")
      .addEventListener("click", async () => {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
      });

    document.getElementById("stop-camera").addEventListener("click", () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });

    document.getElementById("take-photo").addEventListener("click", () => {
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      preview.src = dataUrl;
      preview.style.display = "block";

      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => this.presenter.setCameraBlob(blob));
    });
  }

  setupMap() {
    const map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker = null;

    map.on("click", (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      document.getElementById("latitude").value = lat;
      document.getElementById("longitude").value = lon;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("Picked Location")
        .openPopup();
    });
  }

  showSuccess() {
    const description = document.getElementById("content").value;

    // Send push notification
    sendStoryNotification(description);

    alert("Story successfully added!");
    window.location.hash = "#/";
  }

  showError(message) {
    alert(message);
  }

  destroy() {
    const video = document.getElementById("video");
    const stream = video?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }
}
