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

export const companyAPI = {
    getStats: () => axios.get('/company/stats'),
    getJobs: () => axios.get('/company/jobs'),
    createJob: (data) => axios.post('/company/jobs', data),
    updateJob: (id, data) => axios.put(`/company/jobs/${id}`, data),
    deleteJob: (id) => axios.delete(`/company/jobs/${id}`),
    getMatches: (jobId) => axios.get(`/company/jobs/${jobId}/matches`),
};

export const instituteAPI = {
    getStudents: () => axios.get('/institute/students'),
    getAnalytics: () => axios.get('/institute/analytics'),
    getJobBoard: () => axios.get('/institute/jobs'),
};

export const goalAPI = {
    getTemplates: () => axios.get('/goals/templates'),
    startGoal: (data) => axios.post('/goals/start', data),
    getMyPlan: () => axios.get('/goals/my'),
    getProgress: () => axios.get('/goals/progress'),
    getDiscipline: () => axios.get('/goals/discipline'),
    startQuiz: (taskId) => axios.post(`/goals/tasks/${taskId}/quiz/start`),
    submitQuiz: (taskId, answers) => axios.post(`/goals/tasks/${taskId}/quiz/submit`, { answers }),
    completeTask: (taskId, data) => axios.patch(`/goals/tasks/${taskId}/complete`, data),
    markNotificationsRead: () => axios.patch('/goals/notifications/read'),
    resetGoal: () => axios.delete('/goals/reset'),
};

export const resumeAPI = {
    uploadResume: (formData) => axios.post('/resume/upload', formData),
    getAnalysis: () => axios.get('/resume/analysis'),
};

