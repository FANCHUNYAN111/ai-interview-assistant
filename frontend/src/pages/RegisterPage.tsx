import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
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

      toast.success("注册成功");

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "注册失败"
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
            Start your AI interview journey.
          </h1>

          <p
            className="
            text-lg
            leading-9
            text-gray-500
          "
          >
            使用 AI 模拟真实面试，
            提升表达能力、技术能力，
            更轻松拿下 Offer。
          </p>
        </div>
      </div>

      {/* 右侧注册 */}
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
          {/* 标题 */}
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
              Create account
            </h1>

            <p className="text-gray-500">
              注册你的 AI 面试助手账号
            </p>
          </div>

          {/* 表单 */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
              w-full
              h-14
              rounded-2xl
              border border-gray-300
              px-4
              outline-none
              text-black
              placeholder:text-gray-400

              focus:border-black
              transition
            "
            />

            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
              w-full
              h-14
              rounded-2xl
              border border-gray-300
              px-4
              outline-none
              text-black
              placeholder:text-gray-400

              focus:border-black
              transition
            "
            />

            <button
              onClick={register}
              className="
              w-full
              h-14
              rounded-2xl
              bg-black
              text-white
              font-medium
              hover:opacity-90
              active:scale-[0.99]
              transition
            "
            >
              注册
            </button>
          </div>

          {/* 底部 */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="
              text-gray-500
              hover:text-black
              transition
            "
            >
              已有账号？去登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;