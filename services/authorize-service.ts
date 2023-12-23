import axios from 'axios';

const API_BASE = process.env.REACT_APP_APIENDPOINT || 'http://localhost:4000/api/users';
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
    try {
        const response = await api.post(`${API_BASE}/register`, userData);
        return response.data;
    } catch (error: any) { // 这里使用 any 仅为了解释；在实际代码中应避免使用 any
        if (error.response && error.response.status === 400) {
            throw new Error('User already exist');
        }
        // 更严格的错误处理
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
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
    console.log('this is updated userData', userData);
   const response = await api.put(`${API_BASE}/${uid}`, userData);
   return response.data;
};
