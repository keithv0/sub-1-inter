export default class showDetailCardApp {
  constructor() {
    this.showDetailCard = null;
    this.showDetailCardContainer = null;
    this.showDetailCardImage = null;
    this.showDetailCardContent = null;
    this.isOpen = false;
    this.currentStory = null;
    this.originalCard = null;
  }

  openshowDetailCard(story) {
    this.currentStory = story;

    if (!this.showDetailCard) {
      this.createshowDetailCard();
    }

    this.originalCard = document.querySelector(
      `.story-card[data-story-id="${story.id}"]`
    );

    this.updateshowDetailCardContent(story);

    document.body.appendChild(this.showDetailCard);
    document.body.style.overflow = 'hidden';

    this.isOpen = true;
  }

  updateshowDetailCardContent(story) {
    if (!this.showDetailCardImage || !this.showDetailCardContent) return;

    this.showDetailCardImage.src = story.photoUrl;
    this.showDetailCardImage.alt = story.title;

    const titleEl = this.showDetailCardContent.querySelector('.showDetailCard-title');
    const descriptionEl = this.showDetailCardContent.querySelector(
      '.showDetailCard-description'
    );
    const dateEl = this.showDetailCardContent.querySelector('.showDetailCard-date');

    if (titleEl) titleEl.textContent = story.name;
    if (descriptionEl) descriptionEl.textContent = story.description;
    if (dateEl)
      dateEl.textContent = new Date(story.createdAt).toLocaleDateString();
  }

  closeshowDetailCard() {
    if (!this.isOpen || !this.showDetailCard || !this.showDetailCardContainer) return;

    if (document.startViewTransition) {
      return this.closeshowDetailCardWithViewTransition();
    } else {
      this.removeFromDOM();
    }
  }

  closeshowDetailCardWithViewTransition() {
    return document.startViewTransition(() => {
      this.removeFromDOM();
    }).finished;
  }

  removeFromDOM() {
    if (this.showDetailCard && this.showDetailCard.parentNode) {
      this.showDetailCard.parentNode.removeChild(this.showDetailCard);
    }
    document.body.style.overflow = '';
    this.isOpen = false;
  }

  createshowDetailCard() {
    this.showDetailCard = document.createElement('div');
    this.showDetailCard.className = 'showDetailCard';

    this.showDetailCard.innerHTML = `
      <div class="showDetailCard-overlay"></div>
      <div class="showDetailCard-container">
        <button class="showDetailCard-close-btn">&times;</button>
        <div class="showDetailCard-content">
          <div class="showDetailCard-image-container">
            <img class="showDetailCard-image" src="" alt="Story image">
          </div>
          <div class="showDetailCard-info">
            <h2 class="showDetailCard-title"></h2>
            <p class="showDetailCard-description"></p>
            <span class="showDetailCard-date"></span>
          </div>
        </div>
      </div>
    `;

    this.showDetailCardContainer = this.showDetailCard.querySelector('.showDetailCard-container');
    this.showDetailCardImage = this.showDetailCard.querySelector('.showDetailCard-image');
    this.showDetailCardContent = this.showDetailCard.querySelector('.showDetailCard-content');

    const overlay = this.showDetailCard.querySelector('.showDetailCard-overlay');
    const closeBtn = this.showDetailCard.querySelector('.showDetailCard-close-btn');

    const closeHandler = (e) => {
      e.stopPropagation();
      this.closeshowDetailCard();
    };

    if (overlay) overlay.addEventListener('click', closeHandler);
    if (closeBtn) closeBtn.addEventListener('click', closeHandler);
  }
}
