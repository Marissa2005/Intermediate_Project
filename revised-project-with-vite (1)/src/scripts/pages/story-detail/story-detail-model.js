import { parseActivePathname } from "../../routes/url-parser.js";

const StoryDetailModel = {
  getStoryId() {
    const { id } = parseActivePathname();
    return id;
  },

  getToken() {
    return localStorage.getItem("authToken");  // akses localStorage di model
  },

  async fetchStoryDetail(id, token) {
    const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    return result.story;
  },
};

export default StoryDetailModel;
