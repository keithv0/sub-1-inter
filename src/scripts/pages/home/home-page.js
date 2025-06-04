import messageCard from "../../components/message-card";
import HomePresenter from "./home-presenter";
import showDetailCardApp from "../../animation/show-detail-card";

export default class HomePage {
  #presenter;
  #storiesContainer;
  #loadingIndicator = null;
  #globalLoadingOverlay = null;
  #showDetailCardApp;
  #skipLinkHandler = null;

  async render() {
    return `
      <section class="container view-transition-content">
      
        <div id="globalLoadingOverlay" class="global-loading-overlay" aria-label="Loading content">
          <div class="loading-spinner"></div>
          <div class="loading-text">Memuat konten...</div>
        </div>

        <div class="heading--container" aria-label="Heading container">
          <h1 aria-label="Homepage">Homepage</h1>
        </div>

        <div class="stories-container" aria-label="Container story pengguna">
          <div class="loading-indicator" aria-label="Loading memuat cerita">Memuat cerita...</div>
        </div>
        
      </section>
    `;
  }

  async afterRender() {
    this.#storiesContainer = document.querySelector('.stories-container');
    this.#loadingIndicator = document.querySelector('.loading-indicator');
    this.#globalLoadingOverlay = document.getElementById(
      'globalLoadingOverlay'
    );

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
  }

  #setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');

    if (!skipLink || !mainContent) return;

    this.#skipLinkHandler = (event) => {
      event.prevenDefault();
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

  showError(message) {
    this.hideLoading();
    console.log(message);
  }
}
