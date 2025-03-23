import {BASE_URL} from './config';
import {showToast} from '../utility/Toast';
import {store} from '../store/Store';

const defaultHeaders = {
  'Content-Type': 'application/json',
  // 'Content-Type': 'multipart/form-data',
};

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Params = {
  endPoint: string;
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'; // custom
  body?: Record<string, any>; // object
  headers?: Record<string, string>;
};

const makeRequest = async <T>(params: Params) => {
  const {endPoint, method = 'GET', body = {}, headers = {}} = params;
  const url = BASE_URL + endPoint;
  try {
    const reqHeaders: Record<string, any> = {...defaultHeaders, ...headers};
    console.log('URL: ', url);
    console.log(reqHeaders, 'reqHeaders:');
    console.log(method, 'methodApplied');

    // const user = await getValue('user');
    const user = store.getState().user?.user;
    console.log('Redux Store User:', store.getState().user);

    if (!user || !user.token) {
      console.warn(
        'No valid token found. Authorization header will not be set.',
      );
    } else {
      reqHeaders['authorization'] = 'Bearer ' + user.token;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: reqHeaders,
    };

    if (method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }
    console.log(fetchOptions, 'FetchOptions');

    const response = await fetch(url, fetchOptions);

    console.log(response, 'Api response');
    if (!response.ok) {
      console.log('Status Code: ', response.status);
      throw new Error(`Network error: ${response.statusText}`);
    }
    const result = (await response.json()) as APIResponse<T>;

    console.log('URL: ', url);
    console.log('Body: ', body);
    console.log('Response: ', result);
    console.log('--------------------------------------------');
    if (!result.success) {
      throw new Error(result.message || 'Api Error');
    }
    return result.data;
  } catch (error) {
    console.log('URL: ', url);
    console.log('Body: ', body);
    console.log('Error: ', error);
    console.log('--------------------------------------------');
    showToast({message: (error as Error).message});
    throw error;
  }
};

export default makeRequest;
