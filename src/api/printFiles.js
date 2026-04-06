import { apiClient } from './apiClient';

export const printFilesApi = {
    getPrintFiles: () => apiClient.get('/print-files'),
    uploadPrintFile: (formData) => apiClient.post('/print-files', formData),
    getPrintFile: (id) => apiClient.get(`/print-files/${id}`),
    downloadPrintFile: (id) => apiClient.get(`/print-files/${id}/download`, { responseType: 'blob' }),
    deletePrintFile: (id) => apiClient.delete(`/print-files/${id}`),
};
