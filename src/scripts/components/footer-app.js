class footerApp extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
    }
    render() {
        this.innerHTML = `
    <footer>
      <div class="footer-container">
        <hr />
        <div class="footer-content">

          <a href="#/" class="brand-name" aria-label="Nama Website">
            <img class="logo-footer" src="/favicon.png" alt="Logo App" />
            <span class="title-footer">Send Message</span>
          </a>
          <p>&copy; 2025 Send Message App. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
        `
    }
}
customElements.define('footer-app', footerApp)