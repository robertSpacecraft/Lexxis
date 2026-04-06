import { apiClient } from './apiClient';

export const printOptionsApi = {
    getPrintOptions: () => apiClient.get('/print-options'),
};
