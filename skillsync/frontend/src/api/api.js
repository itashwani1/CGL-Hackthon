import axios from './axiosInstance';

export const authAPI = {
    register: (data) => axios.post('/auth/register', data),
    login: (data) => axios.post('/auth/login', data),
    getMe: () => axios.get('/auth/me'),
};

export const userAPI = {
    getProfile: () => axios.get('/users/profile'),
    updateCareerGoal: (careerGoal) => axios.put('/users/career-goal', { careerGoal }),
    addSkill: (data) => axios.post('/users/skills', data),
    updateSkill: (skillId, data) => axios.put(`/users/skills/${skillId}`, data),
    deleteSkill: (skillId) => axios.delete(`/users/skills/${skillId}`),
};

export const roleAPI = {
    getRoles: (params) => axios.get('/roles', { params }),
    getRole: (id) => axios.get(`/roles/${id}`),
    getCategories: () => axios.get('/roles/categories'),
};

export const analysisAPI = {
    getGapAnalysis: () => axios.get('/analysis/gap'),
    getRecommendations: () => axios.get('/analysis/recommendations'),
    compareWithRole: (roleId) => axios.post('/analysis/compare', { roleId }),
};
