const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5050/api');

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth API
  async signup(username, phoneOrEmail, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, phoneOrEmail, password })
    });
    return res.json();
  },

  async login(phoneOrEmailOrUsername, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phoneOrEmailOrUsername, password })
    });
    return res.json();
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  },

  // Electronics Products API
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`);
    return res.json();
  },

  async createProduct(productData, token) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async deleteProduct(productId, token) {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.json();
  }
};
