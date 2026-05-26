// RIGHT NOW → returns dummy data
// WHEN BACKEND IS READY → just change these functions to axios calls
// That's it. Nothing else changes in your project.

import { products, categories, reviews } from "../data/dummyData";

// Simulate API delay
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── Products ───────────────────────────────────────────
export const getAllProducts = async (filters = {}) => {
  await delay();
  let result = [...products];
  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.search) {
    result = result.filter((p) =>
      p.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  return { data: result };
};

export const getProductById = async (id) => {
  await delay();
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new Error("Product not found");
  return { data: product };
};

export const getCategories = async () => {
  await delay();
  return { data: categories };
};

// ─── Auth (dummy) ────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  await delay(600);
  // Dummy: accept any email/password
  return {
    data: {
      token: "dummy-jwt-token",
      user: { id: "u1", name: "Rahul Sharma", email, role: "user" },
    },
  };
};

export const registerUser = async (userData) => {
  await delay(600);
  return {
    data: {
      token: "dummy-jwt-token",
      user: { id: "u1", ...userData, role: "user" },
    },
  };
};

export const getRelatedProducts = async (category, excludeId) => {
  await delay();
  const result = products
    .filter((p) => p.category === category && p.id !== Number(excludeId))
    .slice(0, 4);
  return { data: result };
};

export const getProductReviews = async (productId) => {
  await delay(300);
  const result = reviews.filter((r) => r.productId === Number(productId));
  return { data: result };
};

/* ─── WHEN BACKEND IS READY ─────────────────────────────
   Replace above with:

import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getAllProducts = (filters) => API.get("/products", { params: filters });
export const getProductById = (id) => API.get(`/products/${id}`);
export const loginUser = (data) => API.post("/auth/login", data);
─────────────────────────────────────────────────────── */