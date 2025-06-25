import CONFIG from '../config';

const ENDPOINTS = {
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/add-new-story`,
};

export async function addNewStory(data, token) {
  const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getAllStories(token) {
  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}
