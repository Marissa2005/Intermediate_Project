const RegisterModel = {
  async registerUser(data) {
    const response = await fetch('https://story-api.dicoding.dev/v1/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    return result;
  },
};

export default RegisterModel;
