import messageCard from "../../components/message-card";
import HomePresenter from "./home-presenter";
import showDetailCardApp from "../../animation/show-detail-card";

import MapPresenter from "../map/map-presenter";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

export default class HomePage {
  #presenter;
  #storiesContainer;
  #loadingIndicator = null;
  #globalLoadingOverlay = null;
  #showDetailCardApp;
  #skipLinkHandler = null;

  #map;
  #storiesLayer;
  #mapPresenter;
  #errorMessageElement;

  async render() {
    return `
      <section class="container view-transition-content">
      
        <div id="globalLoadingOverlay" class="global-loading-overlay" aria-label="Loading content">
          <div class="loading-spinner"></div>
          <div class="loading-text">Memuat konten...</div>
        </div>

        
        <div id="mapSection" class="map-section" aria-label="Map Section">
          
          <div class="heading--container" aria-label="Heading Container">
            <h1 aria-label="Map page">Map Page</h1>
          </div>

          <div id="mapContainer"></div>

          <p id="storyError" class="error-message"></p>
        </div>

        <div class="card-page">
        
          <div class="heading--container" aria-label="Heading container">
            <h1 aria-label="Homepage">Homepage</h1>
          </div>
          
          <div class="stories-container" aria-label="Container story pengguna">

            <div class="loading-indicator" aria-label="Loading memuat cerita">Memuat cerita...</div>
          </div>
        </div>
        
      </section>
    `;
  }

  async afterRender() {
    this.#storiesContainer = document.querySelector('.stories-container');
    this.#loadingIndicator = document.querySelector('.loading-indicator');
    this.#globalLoadingOverlay = document.getElementById('globalLoadingOverlay');
    this.#errorMessageElement = document.getElementById('storyError')

    if (!this.#storiesContainer) {
      console.error('DOM stories-container belum ada!');
      return;
    }

    this.#storiesContainer.setAttribute('tabindex', '-1');

    this.#setupSkipLink();

    this.hideLoading();
    this.#showDetailCardApp = new showDetailCardApp();
    this.#presenter = new HomePresenter({ view: this });
    try {
      this.showLoading();
      await this.#presenter.init();
    } catch (error) {
      console.error('Error initializing HomePresenter:', error);
      this.showError('GAGAl MEMUAT CERITA');
      this.hideLoading();
    }

    this.#initMap();
    this.#mapPresenter = new MapPresenter({ view:this });
    await this.#mapPresenter.init();
  }

  #setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');

    if (!skipLink || !mainContent) return;

    this.#skipLinkHandler = (event) => {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView();
    }
    skipLink.addEventListener('click', this.#skipLinkHandler)
  }

  showLoading() {
    if (this.#globalLoadingOverlay) {
      this.#globalLoadingOverlay.style.display = 'flex';
    }

    if (this.#loadingIndicator) {
      this.#loadingIndicator.style.display = 'block';
    }
  }

  hideLoading() {
    if (this.#globalLoadingOverlay) {
      this.#globalLoadingOverlay.style.display = 'none';
    }

    if (this.#loadingIndicator) {
      this.#loadingIndicator.style.display = 'none';
    }
  }

  showStories(stories) {
    if (!this.#storiesContainer) {
      console.error("Element 'stories-container' not found.");
      return;
    }

    if (!stories || stories.length === 0) {
      this.#storiesContainer.innerHTML =
        '<p>Belum ada cerita untuk ditampilkan.</p>';
      return;
    }

    this.#storiesContainer.innerHTML = stories
      .map((story) => new messageCard(story).render())
      .join('');
  }

  attachStoryCardListeners(stories) {
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const storyId = card.dataset.storyId;
        const story = stories.find((s) => s.id === storyId);
        if (story) {
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              this.#showDetailCardApp.openshowDetailCard(story);
            });
          } else {
            this.#showDetailCardApp.openshowDetailCard(story);
          }
        }
      });
    });
  }

    #initMap() {
      const mapContainer = L.DomUtil.get('mapContainer');

      if (!mapContainer) {
        console.log("element mapContainer tidak ditemukan");
      }

      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }

      this.#map = L.map('mapContainer').setView([-3.0, 118.0], 5);
  
      const osmStandard = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
  
      const openTopoMap = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }
      );
  
      const cartoDbPositron = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
        }
      );
  
      const cartoDbDarkMatter = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
        }
      );
  
      const baseLayers = {
        'OpenStreetMap Standard': osmStandard,
        OpenTopoMap: openTopoMap,
        'Carto DB Positron': cartoDbPositron,
        'Carto DB Dark Matter': cartoDbDarkMatter,
      };
  
      this.#storiesLayer = L.featureGroup();
  
      const overlayLayers = {
        'Lokasi Cerita': this.#storiesLayer,
      };
  
      L.control.layers(baseLayers, overlayLayers).addTo(this.#map);
  
      osmStandard.addTo(this.#map);
  
      this.#storiesLayer.addTo(this.#map);
  
      this.#map.invalidateSize();
    }

      renderMapMarkers(locations) {
    if (!this.#map || !this.#storiesLayer) {
      console.error('Belum terinisialisasi');
      return;
    }

    this.#storiesLayer.clearLayers();

    locations.forEach((location) => {
      if (location && location.lat !== null && location.lon !== null) {
        const marker = L.marker([location.lat, location.lon]);

        let popupContent = `<b>${location.name || 'Tanpa Nama'}</b>`;
        if (location.description) {
          const shortDescription =
            location.description.substring(0, 20) +
            (location.description.length > 20 ? '...' : '');
          popupContent += `<br>${shortDescription}`;
        }
        if (location.photoUrl) {
          popupContent += `<br><img src="${location.photoUrl}" alt="Gambar story ${location.nama}" aria-label="Lokasi cerita: Nama lokasi" class="image-popup">`;
        }

        if (location.createdAt) {
          const date = new Date(location.createdAt).toLocaleDateString('id-ID');
          popupContent += `<br><small>${date}</small>`;
        }
        marker.bindPopup(popupContent);
        marker.addTo(this.#storiesLayer);
      } else {
        console.warn('skip, karena tidak valid', location);
      }
    });

    if (this.#storiesLayer.getLayers().length > 0) {
      try {
        const bounds = this.#storiesLayer.getBounds();
        if (bounds.isValid()) {
          this.#map.fitBounds(bounds, { padding: [50, 50] });
        } else if (this.#storiesLayer.getLayers().length === 1) {
          this.#map.setView(this.#storiesLayer.getLayers()[0].getLatLng(), 10);
        } else {
          this.#map.setView([-3.0, 118.0], 5);
        }
      } catch (error) {
        console.error('Error waktu bound : ', error);
        this.#map.setView([-3.0, 118.0], 5);
      }
    } else {
      this.#map.setView([-3.0, 118.0], 5);
    }
  }

  showError(message) {
    console.error('Pesan error', message);
    if (this.#errorMessageElement) {
      this.#errorMessageElement.textContent = message;
      this.#errorMessageElement.style.display = 'block';
    }

    this.hideLoading();

    if (this.#storiesLayer) this.#storiesLayer.clearLayers();
    if (this.#map) this.#map.setView([-3.0, 118.0], 5);
  }

  hideError() {
    if (this.#errorMessageElement) {
      this.#errorMessageElement.textContent = '';
      this.#errorMessageElement.style.display = 'none';
    }
  }
  destroy() {
    // console.log("destroying home page and cleaning up map");
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }

    const skipLink = document.querySelector('.skip-link');
    if (skipLink && this.#skipLinkHandler) {
      skipLink.removeEventListener('click', this.#skipLinkHandler)
    }
  }
}
