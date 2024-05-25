import axios from "axios";

const API_URL = "http://localhost:5000/jobs";

export const getJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createJob = async (job) => {
  try {
    const response = await axios.post(API_URL, job);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (id, job) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, job);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
