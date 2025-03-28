import { post } from "@/lib/request";

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  data: {
    accessToken: string;
    //   refreshToken: string;
  };
}

// 用户登录
export const loginApi = (params: LoginParams) => {
  return post<LoginResponse>("/user/login", params);
};
