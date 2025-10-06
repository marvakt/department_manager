import axios from "axios";

const BASE_URL = "https://employee-react.onrender.com/emp";

// ===== Auth =====
export const registerUser = async ({ name, email, password }) => {
  return axios.post(`${BASE_URL}/register`, { name, email, password });
};

export const loginUser = async ({ email, password }) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};

// ===== Departments =====
export const getDepartments = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  return axios.get(`${BASE_URL}/departments`, {
    headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed
  });
};

export const addDepartment = async ({ name, description }) => { // ✅ Use 'name' instead of 'dept_name'
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  return axios.post(
    `${BASE_URL}/add-department`,
    { name, description },
    {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed
    }
  );
};

export const deleteDepartment = async (deptId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  return axios.delete(`${BASE_URL}/delete-department/${deptId}`, {
    headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed
  });
};

export const getOneDepartment = async (deptId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  return axios.get(`${BASE_URL}/department/${deptId}`, {
    headers: { Authorization: `Bearer ${token}` }, 
  });
};
