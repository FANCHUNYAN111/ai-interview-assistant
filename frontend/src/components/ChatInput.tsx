import { useState } from "react";

interface Props {
  onSend: (message: string) => void;

  loading: boolean;
}

function ChatInput({
  onSend,
  loading,
}: Props) {
  // 输入内容
  const [message, setMessage] =
    useState("");

  // 点击发送
  const handleSend = () => {
    // 空内容不发送
    if (!message.trim()) return;

    // 调用父组件函数
    onSend(message);

    // 清空输入框
    setMessage("");
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-[#343541]">
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* 输入框 */}
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="请输入岗位..."
          className="flex-1 p-4 rounded-xl bg-[#40414f] text-white outline-none"
        />

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 transition px-6 rounded-xl text-white"
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;