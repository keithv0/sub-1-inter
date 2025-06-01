import { getLocation } from "../../data/story-api";

export default class MapPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    this.#view.showLoading();
    try {
      const stories = await this.getAllStoriesLocation();

      // Filter dan validasi data lokasi
      const locations = stories
        .filter(
          (story) =>
            story.lat !== null &&
            story.lat !== undefined &&
            story.lon !== null &&
            story.lon !== undefined &&
            !isNaN(story.lat) &&
            !isNaN(story.lon)
        )
        .map((story) => ({
          id: story.id,
          name: story.name,
          description: story.description,
          lat: parseFloat(story.lat),
          lon: parseFloat(story.lon),
          photoUrl: story.photoUrl,
          createdAt: story.createdAt,
        }));

      console.log(`Found ${locations.length} stories with valid locations`);

      if (locations.length === 0) {
        this.#view.showError('Tidak ada cerita dengan lokasi yang valid.');
      } else {
        this.#view.renderMapMarkers(locations);
      }
    } catch (error) {
      console.error('ERROR in MapPresenter init:', error);
      
      let errorMessage = 'Terjadi kesalahan saat memuat peta.';
      if (error.message.includes('invalid JSON') || error.message.includes('response format')) {
        errorMessage = 'Server mengembalikan response yang tidak valid untuk data lokasi.';
      } else if (error.message.includes('HTTP error! status: 401')) {
        errorMessage = 'Token autentikasi tidak valid untuk mengakses data lokasi.';
      }
      
      this.#view.showError(errorMessage);
    } finally {
      this.#view.hideLoading();
    }
  }

  async getAllStoriesLocation() {
    try {
      console.log('Fetching stories with location...');
      
      const stories = await getLocation();
      // console.log('Location stories response:', stories);
      
      // Handle berbagai format response
      let storyList = [];
      if (stories && typeof stories === 'object') {
        storyList = stories.listStory || stories.data || stories || [];
      }
      
      if (!Array.isArray(storyList)) {
        console.warn('Expected array but got:', typeof storyList);
        return [];
      }
      
      return storyList;
    } catch (error) {
      console.error('Error fetching stories with location:', error);
      
      let errorMessage = 'Gagal memuat cerita dengan lokasi!';
      if (error.message.includes('invalid JSON')) {
        errorMessage = 'Server mengembalikan response HTML bukan JSON untuk data lokasi.';
      } else if (error.message.includes('HTTP error! status: 404')) {
        errorMessage = 'Endpoint untuk data lokasi tidak ditemukan.';
      }
      
      this.#view.showError(errorMessage);
      return [];
    }
  }
}