import {BASE_URL} from './config';
import {showToast} from '../utility/Toast';
import {store} from '../store/Store';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Params = {
  endPoint: string;
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  body?: Record<string, any>; // ✅ use 'body' consistently
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

const isFormData = (data: object | undefined): data is FormData => {
  return (data as FormData)?.append !== undefined;
};

const makeRequest = async <T>(params: Params) => {
  const {
    endPoint,
    method = 'GET',
    body = {},
    headers = {},
    params: queryParams = {},
  } = params;

  let url = BASE_URL + endPoint;

  // Append query params if any (for GET)
  if (method === 'GET' && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }

  try {
    const reqHeaders: Record<string, any> = {...defaultHeaders, ...headers};

    const user = store.getState().user?.user;
    if (user?.token) {
      reqHeaders['authorization'] = 'Bearer ' + user.token;
    } else {
      console.warn(
        'No valid token found. Authorization header will not be set.',
      );
    }

    const fetchOptions: RequestInit = {
      method,
      headers: reqHeaders,
    };

    if (method !== 'GET' && body && Object.keys(body).length > 0) {
      fetchOptions.body = isFormData(body) ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      console.log('Status Code: ', response.status);
      throw new Error(`Network error: ${response.statusText}`);
    }

    const result = (await response.json()) as APIResponse<T>;

    console.log('URL:', url);
    console.log('Body:', body);
    console.log('Header:', reqHeaders);
    console.log('Response:', result);
    console.log('--------------------------------------------');

    if (!result.success) {
      throw new Error(result.message || 'API Error');
    }

    return result.data;
  } catch (error) {
    console.log('URL:', url);
    console.log('Body:', body);
    console.log('Error:', error);
    console.log('--------------------------------------------');
    showToast({message: (error as Error).message});
    throw error;
  }
};

export default makeRequest;
