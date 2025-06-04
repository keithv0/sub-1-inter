class headerApp extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <header>
        <div class="main-header container">
            <a 
              class="brand-name" 
              aria-label="Nama Website"
              href="#/"
            >
              Send Message
            </a>

            <nav 
              id="navigation-drawer" 
              class="navigation-drawer"
              aria-label="Navigasi"
              >
              <ul id="nav-list" class="nav-list"></ul>
            </nav>

            <button 
              id="drawer-button" 
              class="drawer-button"
              aria-label="Tombol Drawer"
              >
              ☰
              </button>
      </div>
    </header>

    `;
  }
}

customElements.define('header-app', headerApp)
