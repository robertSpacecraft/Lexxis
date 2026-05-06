import { apiClient } from './apiClient';

export const printJobsApi = {
    getAllPrintJobs: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/print-jobs${query ? `?${query}` : ''}`);
    },
    getPrintJobs: (fileId) => apiClient.get(`/print-files/${fileId}/jobs`),
    createPrintJob: (fileId, payload) => apiClient.post(`/print-files/${fileId}/jobs`, payload),
    getPrintJob: (fileId, jobId) => apiClient.get(`/print-files/${fileId}/jobs/${jobId}`),
    updatePrintJob: (fileId, jobId, payload) => apiClient.patch(`/print-files/${fileId}/jobs/${jobId}`, payload),
    recalculatePrintJob: (fileId, jobId) => apiClient.post(`/print-files/${fileId}/jobs/${jobId}/recalculate`),
    continueWithoutReview: (fileId, jobId) => apiClient.post(`/print-files/${fileId}/jobs/${jobId}/continue-without-review`),
    deletePrintJob: (fileId, jobId) => apiClient.delete(`/print-files/${fileId}/jobs/${jobId}`),
};
