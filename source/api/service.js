import api from '.';

export const fetchProjects = async ({businessKey, page, limit}) => {
  try {
    const response = await api.get(
      `/projects/${businessKey}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export const fetchGrowatt = async ({businessKey}) => {
  try {
    const response = await api.get(`/inverters/growatt/${businessKey}`);
    console.log(businessKey);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};
