window.AuthModel = {
  async login(email, password) {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: true, message: result.message || "Login gagal" };
    }

    // Simpan token langsung di model
    localStorage.setItem("authToken", result.loginResult.token);

    return result;
  },
};
