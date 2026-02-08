import { apiClient } from './apiClient';

export const printFilesApi = {
    getPrintFiles: () => apiClient.get('/print-files'),
    uploadPrintFile: (formData) => apiClient.post('/print-files', formData),
    getPrintFile: (id) => apiClient.get(`/print-files/${id}`),
    downloadPrintFile: async (id) => {
        const token = localStorage.getItem('lexxis_token');
        const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
        const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';
        const url = `${BASE_URL.replace(/\/$/, '')}${API_PREFIX}/print-files/${id}/download`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error('Download failed');

        return response.blob();
    }
};
