/**
 * Serverless Dynamic Components for adranin
 * Utilizes standard Web Components (Custom Elements) to inject fragments seamlessly.
 * Detects current directory nesting to automatically resolve relative URLs (e.g., assets and pages).
 */

const getRootPrefix = () => {
  const path = window.location.pathname;
  if (path.includes('/case-studies/')) {
    return '../';
  }
  return '';
};

const resolvePaths = (html, rootPrefix) => {
  return html.replace(/\{\{root\}\}/g, rootPrefix);
};

// Define Global Header Component
class GlobalHeader extends HTMLElement {
  async connectedCallback() {
    const rootPrefix = getRootPrefix();
    try {
      const response = await fetch(`${rootPrefix}_header.html`);
      if (!response.ok) throw new Error('Failed to fetch header component');
      let html = await response.text();
      this.innerHTML = resolvePaths(html, rootPrefix);
      window.dispatchEvent(new CustomEvent('component-loaded', { detail: { type: 'header' } }));
    } catch (err) {
      console.error(err);
      this.innerHTML = `<p style="padding: 20px; text-align: center; color: red;">Error loading navigation.</p>`;
    }
  }
}
customElements.define('global-header', GlobalHeader);

// Define Global Footer Component
class GlobalFooter extends HTMLElement {
  async connectedCallback() {
    const rootPrefix = getRootPrefix();
    try {
      const response = await fetch(`${rootPrefix}_footer.html`);
      if (!response.ok) throw new Error('Failed to fetch footer component');
      let html = await response.text();
      this.innerHTML = resolvePaths(html, rootPrefix);
      window.dispatchEvent(new CustomEvent('component-loaded', { detail: { type: 'footer' } }));
    } catch (err) {
      console.error(err);
    }
  }
}
customElements.define('global-footer', GlobalFooter);

// Define Global Contact Component
class GlobalContact extends HTMLElement {
  async connectedCallback() {
    const rootPrefix = getRootPrefix();
    try {
      const response = await fetch(`${rootPrefix}_contact.html`);
      if (!response.ok) throw new Error('Failed to fetch contact component');
      let html = await response.text();
      this.innerHTML = resolvePaths(html, rootPrefix);
      window.dispatchEvent(new CustomEvent('component-loaded', { detail: { type: 'contact' } }));
    } catch (err) {
      console.error(err);
    }
  }
}
customElements.define('global-contact', GlobalContact);

// Define Global Lightbox Component
class GlobalLightbox extends HTMLElement {
  async connectedCallback() {
    const rootPrefix = getRootPrefix();
    try {
      const response = await fetch(`${rootPrefix}_lightbox.html`);
      if (!response.ok) throw new Error('Failed to fetch lightbox component');
      let html = await response.text();
      this.innerHTML = resolvePaths(html, rootPrefix);
      window.dispatchEvent(new CustomEvent('component-loaded', { detail: { type: 'lightbox' } }));
    } catch (err) {
      console.error(err);
    }
  }
}
customElements.define('global-lightbox', GlobalLightbox);