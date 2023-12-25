import axios from 'axios';

const API_BASE = process.env.REACT_APP_APIENDPOINT || 'http://localhost:4000/api/users';

const api = axios.create({
    withCredentials: true,
});

export const findUserById = async (userId) => {
    try {
        const response = await api.get(`${API_BASE}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Update failed:', error);
        throw error;
    }
};
