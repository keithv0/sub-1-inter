import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export default class MapView {
  #map;
  #storiesLayer;
  #containerId;

  constructor(containerId) {
    this.#containerId = containerId;
  }

  initMap() {
    const mapElement = document.getElementById(this.#containerId);
    if (!mapElement) {
      console.error(`Element with ID '${this.#containerId}' not found.`);
      return;
    }

    this.#map = L.map(this.#containerId).setView([-3.0, 118.0], 5);

    const osmStandard = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    });

    this.#storiesLayer = L.featureGroup();

    const baseLayers = {
      "OpenStreetMap Standard": osmStandard,
    };
    const overlays = {
      "Lokasi Cerita": this.#storiesLayer,
    };

    L.control.layers(baseLayers, overlays).addTo(this.#map);
    osmStandard.addTo(this.#map);
    this.#storiesLayer.addTo(this.#map);
    this.#map.invalidateSize();
  }

  renderMarkers(locations) {
    if (!this.#map || !this.#storiesLayer) return;

    this.#storiesLayer.clearLayers();

    locations.forEach((location) => {
      if (!location.lat || !location.lon) return;

      const marker = L.marker([location.lat, location.lon]);
      let popupContent = `<b>${location.name || "Tanpa Nama"}</b>`;
      if (location.description) {
        const shortDesc = location.description.substring(0, 20) + "...";
        popupContent += `<br>${shortDesc}`;
      }
      if (location.photoUrl) {
        popupContent += `<br><img src="${location.photoUrl}" class="image-popup">`;
      }
      if (location.createdAt) {
        const date = new Date(location.createdAt).toLocaleDateString("id-ID");
        popupContent += `<br><small>${date}</small>`;
      }

      marker.bindPopup(popupContent).addTo(this.#storiesLayer);
    });

    const bounds = this.#storiesLayer.getBounds();
    if (bounds.isValid()) {
      this.#map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      this.#map.setView([-3.0, 118.0], 5);
    }
  }

  clearMarkers() {
    this.#storiesLayer?.clearLayers();
  }

  resetView() {
    this.#map?.setView([-3.0, 118.0], 5);
  }
}
