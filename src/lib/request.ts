/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: "https://xmc-saas-bgw-dev.azure-api.net/api/grag-demo",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    // 登录接口不需要添加 token
    if (!config.url?.includes("/user/login")) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        // 如果需要 token 但没有 token，可以在这里处理，比如跳转到登录页
        window.location.href = "/login";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          break;
        case 403:
          // 处理禁止访问
          break;
        case 404:
          // 处理未找到
          break;
        case 500:
          // 处理服务器错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return http.get(url, config);
};

// 封装 POST 请求
export const post = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return http.post(url, data, config);
};

// 封装 PUT 请求
export const put = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return http.put(url, data, config);
};

// 封装 DELETE 请求
export const del = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return http.delete(url, config);
};

export default http;
