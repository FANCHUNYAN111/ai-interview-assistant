import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const register = async () => {
    try {
      await api.post("/api/auth/register", {
        email,
        password,
      });

      alert("注册成功");

      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "注册失败"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#343541] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#444654] rounded-2xl p-8">
        <h1 className="text-3xl text-white font-bold text-center mb-8">
          注册
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
            onClick={register}
            className="bg-green-500 hover:bg-green-600 transition p-4 rounded-xl text-white font-bold"
          >
            注册
          </button>

          <Link
            to="/login"
            className="text-center text-gray-300"
          >
            已有账号？去登录
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;