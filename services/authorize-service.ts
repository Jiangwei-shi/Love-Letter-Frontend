import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_APIENDPOINT || 'http://localhost:4000/api/users';
interface UserData {
    username: string;
    password: string;
}
interface UserId {
    _id: string;
}
const api = axios.create({
    withCredentials: true,
});

export const registerUser = async (userData: UserData) => {
    const response = await api.post(`${API_BASE}/register`, userData);
    return response.data;
};

export const loginUser = async (userData: UserData) => {
    const response = await api.post(`${API_BASE}/login`, userData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post(`${API_BASE}/logout`);
    return response.data;
};

export const deleteUser = async (uid: UserId) => {
    const response = await api.delete(`${API_BASE}/${uid}`);
    return response.data;
};

export const updateUser = async (uid: String, userData: any) => {
   const response = await api.put(`${API_BASE}/${uid}`, userData);
   return response.data;
};
