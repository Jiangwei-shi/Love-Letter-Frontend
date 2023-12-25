import axios from 'axios';

const API_BASE = 'https://create-your-own-website.onrender.com/api/users';

const api = axios.create({
    withCredentials: true,
});

export const findUserById = async (userId:String) => {
    try {
        const response = await api.get(`${API_BASE}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Update failed:', error);
        throw error;
    }
};
