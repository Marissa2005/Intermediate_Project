const AddNewStoryModel = {
  getToken() {
    return localStorage.getItem("authToken");
  },

  async submitStory(formData) {
    const token = this.getToken();
    if (!token) throw new Error("Anda perlu login terlebih dahulu.");

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  }
};

export default AddNewStoryModel;
