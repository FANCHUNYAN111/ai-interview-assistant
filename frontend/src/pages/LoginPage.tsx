import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {
    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/chat");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "登录失败"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#343541] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#444654] rounded-2xl p-8">
        <h1 className="text-3xl text-white font-bold text-center mb-8">
          登录
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="p-4 rounded-xl bg-[#343541] text-white outline-none"
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="p-4 rounded-xl bg-[#343541] text-white outline-none"
          />

          <button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 transition p-4 rounded-xl text-white font-bold"
          >
            登录
          </button>

          <Link
            to="/register"
            className="text-center text-gray-300"
          >
            没有账号？去注册
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;