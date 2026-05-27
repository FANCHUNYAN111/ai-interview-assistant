import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
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
      toast.success("登录成功");

      navigate("/chat");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "登录失败"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* 左侧 */}
      <div
        className="
        hidden
        lg:flex
        flex-1
        border-r border-gray-200
        items-center
        justify-center
        p-12
      "
      >
        <div className="max-w-xl">
          <p
            className="
            text-sm
            uppercase
            tracking-[0.2em]
            text-gray-400
            mb-6
          "
          >
            AI Interview Assistant
          </p>

          <h1
            className="
            text-6xl
            font-semibold
            tracking-tight
            leading-tight
            text-black
            mb-8
          "
          >
            Practice interviews with AI.
          </h1>

          <p
            className="
            text-lg
            leading-9
            text-gray-500
          "
          >
            生成面试题、模拟真实面试、
            AI 点评回答并给出优化建议，
            帮助你更高效准备技术面试。
          </p>
        </div>
      </div>

      {/* 右侧登录 */}
      <div
        className="
        flex-1
        flex
        items-center
        justify-center
        p-6
      "
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center">
            <h1
              className="
              text-4xl
              font-semibold
              tracking-tight
              text-black
              mb-3
            "
            >
              Welcome back
            </h1>

            <p className="text-gray-500">
              登录你的 AI 面试助手账号
            </p>
          </div>

          {/* 表单 */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }

            />

            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }

            />

            <Button
              onClick={login}

            >
              登录
            </Button>
          </div>

          {/* 底部 */}
          <div className="mt-8 text-center">
            <Link
              to="/register"
              className="
              text-gray-500
              hover:text-black
              transition
            "
            >
              没有账号？立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;