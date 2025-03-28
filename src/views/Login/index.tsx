import { loginApi } from "@/apis/user";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Login() {
  const nav = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const login = async () => {
    localStorage.clear();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (username && password) {
      try {
        const res = await loginApi({ username, password });
        // 存储 accessToken
        localStorage.setItem("accessToken", res.data.accessToken);
        nav("/");
        toast.success("登录成功");
      } catch {
        localStorage.clear();
        toast.error("登录失败，请检查用户名和密码");
      }
    } else {
      toast.error("请输入用户名和密码");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">伏羲一号</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="username"
              className="block text-base font-bold text-gray-700 mb-1 w-20"
            >
              用户名：
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              id="username"
              type="text"
              placeholder="请输入用户名"
              ref={usernameRef}
              autoComplete="username"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="password"
              className="block text-base font-bold text-gray-700 mb-1 w-20"
            >
              密码：
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              id="password"
              type="password"
              placeholder="请输入密码"
              ref={passwordRef}
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <button
              className=" cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => login()}
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
