import { BASE_URL } from "../config";
import { getAuthToken } from "../utils/auth";

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

    return await response.json();
  } catch (error) {
    console.error("Error fetching all stories:", error);
    throw error;
  }
}

export async function addNewStory(formData) {
  try {
    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to add Message: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding new Message:", error);
    throw error;
  }
}

export async function getLocation() {
  try {
    const locationEnable = 1;
    const size = 5;
    const response = await fetch(`${ENDPOINTS.STORIES}?location=${locationEnable}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      cache: 'reload',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories with location: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stories with location:", error);
    throw error;
  }
}
