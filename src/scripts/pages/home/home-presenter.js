import { getAllStories } from '../../data/story-api';

export default class HomePresenter {
  #view;
  #storiesData;
  #storiesArray = [];

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    try {
      this.#view.showLoading();

      await this.getAllStories();

      this.#prepareStoriesArray();
      this.#view.showStories(this.#storiesData);
      this.#view.attachStoryCardListeners(this.#storiesArray);
      this.#view.hideLoading();
    } catch (error) {
      console.error('Error during initialization:', error);
      this.#view.showError('Terjadi kesalahan saat memuat data.');
    }
  }

  async getAllStories() {
    try {
      const stories = await getAllStories();
      this.#storiesData = stories.listStory || [];
      return this.#storiesData;
    } catch (error) {
      this.#view.showError('Gagal memuat cerita!');
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  #prepareStoriesArray() {
    if (Array.isArray(this.#storiesData)) {
      this.#storiesArray = this.#storiesData;
    } else if (this.#storiesData && typeof this.#storiesData === 'object') {
      if (
        this.#storiesData.listStory &&
        Array.isArray(this.#storiesData.listStory)
      ) {
        this.#storiesArray = this.#storiesData.listStory;
      } else if (Object.values(this.#storiesData).some(Array.isArray)) {
        for (const key in this.#storiesData) {
          if (Array.isArray(this.#storiesData[key])) {
            this.#storiesArray = this.#storiesData[key];
            break;
          }
        }
      } else {
        this.#storiesArray = Object.values(this.#storiesData).filter(
          (item) => item && typeof item === 'object'
        );
      }
    } else {
      this.#storiesArray = [];
      console.warn('Data stories bukan array atau object:', this.#storiesData);
    }
  }
}