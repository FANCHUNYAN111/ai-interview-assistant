import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: Props) {
  // 获取 token
  const token = localStorage.getItem("token");

  // 没有 token
  if (!token) {
    // 跳转登录页
    return <Navigate to="/login" replace />;
  }

  // 已登录
  return children;
}

export default ProtectedRoute;