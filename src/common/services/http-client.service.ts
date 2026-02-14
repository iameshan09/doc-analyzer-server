import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  ResponseType,
} from 'axios';

interface RequestOptions<H> {
  responseType?: ResponseType;
  auth?: boolean;
  authToken?: string | null;
  headers?: H;
}

class HttpClientService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  async request<T = any, D = any, H = object>(
    method: Method,
    url: string,
    params: Record<string, any>,
    { responseType, auth, authToken, headers }: RequestOptions<H> = {},
  ): Promise<AxiosResponse<T, D, H>> {
    const body: 'params' | 'data' = ['GET', 'get'].includes(method)
      ? 'params'
      : 'data';

    const config: AxiosRequestConfig = {
      method,
      url,
      [body]: params || {},
    };

    if (!config.headers) {
      config.headers = {};
    }

    if (headers) {
      config.headers = {
        ...config.headers,
        ...headers,
      };
    }

    if (responseType) {
      config.responseType = responseType;
    }
    if (auth && authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return await this.axiosInstance.request(config);
  }
}
export default HttpClientService;
