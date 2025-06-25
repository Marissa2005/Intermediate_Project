import StoryDetailModel from './story-detail-model.js';
import StoryDetailPresenter from './story-detail-presenter.js';

export default class StoryDetailPage {
  async render() {
    return `<section id="story-detail" tabindex="-1" class="container story-detail-container">Loading...</section>`;
  }

  async afterRender() {
    this.presenter = StoryDetailPresenter(this, StoryDetailModel);
    await this.presenter.init();
  }

  showStoryDetail(story) {
    const container = document.getElementById("story-detail");

    container.innerHTML = `
      <h1>Story Detail</h1>
      <h2>${story.name}</h2>
      <img src="${story.photoUrl}" alt="${story.name}" width="300" />
      <p>${story.description}</p>
      <p><strong>Dibuat pada:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
      <div id="map" style="width: 100%; height: 400px;"></div>
    `;

    if (
      story.lat !== undefined &&
      story.lon !== undefined &&
      story.lat !== null &&
      story.lon !== null &&
      !isNaN(story.lat) &&
      !isNaN(story.lon)
    ) {
      const map = L.map("map").setView([story.lat, story.lon], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`Cerita: ${story.name}`)
        .openPopup();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            L.marker([userLat, userLng], {
              icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              }),
            })
              .addTo(map)
              .bindPopup("Lokasi Anda")
              .openPopup();

            const bounds = L.latLngBounds([
              [story.lat, story.lon],
              [userLat, userLng],
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
          }
        );
      }
    } else {
      document.getElementById("map").innerHTML =
        "<p>Lokasi tidak tersedia untuk cerita ini.</p>";
    }
  }

  showError(message) {
    document.getElementById("story-detail").innerHTML = `<p>${message}</p>`;
  }
}
