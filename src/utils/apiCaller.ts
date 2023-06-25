import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

const backendUrl: string =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/';

const instance: AxiosInstance = axios.create({
  baseURL: backendUrl,
  // withCredentials: true,
});

export default async function callAPI<T>(
  endpoint: string,
  method: string = 'POST',
  data?: any
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    method: method,
    url: endpoint,
    data: data,
  };

  try {
    const response: AxiosResponse<T> = await instance(config);
    return response;
  } catch (error: any) {
    throw new Error(`API request failed: ${error.message}`);
  }
}
