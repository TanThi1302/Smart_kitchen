import api from './api';

export const getBrands = async () => {
  try {
    const response = await api.get('/products/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { success: false, data: [] };
  }
};
