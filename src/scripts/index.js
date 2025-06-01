// CSS imports
import '../styles/style.css'

import App from './pages/app.js';
import './components/header-app.js'

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

import { BASE_URL } from './config.js';
import { getAuthToken } from './utils/auth.js';

const ENDPOINTS = {
    STORIES: `${BASE_URL}/stories`,
};

export async function getAllStories() {
  try {
    const size = 12;
    const response = await fetch(`${ENDPOINTS.STORIES}?size=${size}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      cache: 'reload',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const data = await response.json()
    console.log("cek repons", data);
    return await response.json();
  } catch (error) {
    console.error("Error fetching all stories:", error);
    throw error;
  }
}
// getAllStories()