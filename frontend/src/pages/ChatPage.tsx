import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";

import ChatInput from "../components/ChatInput";

import MessageBubble from "../components/MessageBubble";

import api from "../services/api";

interface Message {
  id?: string;

  role: "user" | "assistant";

  content: string;
}

interface Conversation {
  id: string;

  title: string;
}

function ChatPage() {
  const navigate = useNavigate();

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    currentConversationId,
    setCurrentConversationId,
  ] = useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);
  // 获取消息
  const fetchMessages = async (
    conversationId: string
  ) => {
    try {
      const response = await api.get(
        `/api/conversations/${conversationId}/messages`
      );

      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchConversations = async () => {
    try {
      const response =
        await api.get("/api/conversations");

      const data = response.data;

      setConversations(data);

      // 只初始化一次
      if (
        data.length > 0 &&
        !currentConversationId
      ) {
        const firstId = data[0].id;

        setCurrentConversationId(firstId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 检查登录
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // 加载会话列表
  useEffect(() => {
    const loadConversations = async () => {
      await fetchConversations();
    };

    loadConversations();
  }, []);

  // 加载当前会话消息
  useEffect(() => {
    if (currentConversationId) {
      const loadConversations = async () => {
        await fetchMessages(currentConversationId);;
      };

      loadConversations();

    }
  }, [currentConversationId]);

  // 获取会话列表



  // 创建聊天
  const createConversation = async () => {
    try {
      const response =
        await api.post("/api/conversations");

      const newConversation =
        response.data;

      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      setCurrentConversationId(
        newConversation.id
      );

      setMessages([]);

      // 手机端关闭 sidebar
      setMobileOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 删除聊天
  const deleteConversation = async (
    id: string
  ) => {
    try {
      await api.delete(
        `/api/conversations/${id}`
      );
      toast.success("删除成功");
      const updated =
        conversations.filter(
          (item) => item.id !== id
        );

      setConversations(updated);

      // 如果删的是当前聊天
      if (currentConversationId === id) {
        if (updated.length > 0) {
          setCurrentConversationId(
            updated[0].id
          );
        } else {
          setCurrentConversationId("");

          setMessages([]);
        }
      }
    } catch (error) {
      console.error(error);

      toast.error("AI 回复失败");
    }
  };

  // 发送消息（流式输出）
  const sendMessage = async (
    content: string
  ) => {
    if (!currentConversationId) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/interview",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            job: content,

            conversationId:
              currentConversationId,
          }),
        }
      );

      const reader =
        response.body?.getReader();

      if (!reader) return;

      let aiText = "";

      // 创建空 AI 消息
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk =
          new TextDecoder().decode(
            value
          );

        aiText += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: aiText,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      await fetchConversations();
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentId={currentConversationId}
        onSelect={(id) => {
          setCurrentConversationId(id);

          setMobileOpen(false);
        }}
        onNewChat={createConversation}
        onDelete={deleteConversation}
        mobileOpen={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      {/* 右侧区域 */}
      <div className="flex-1 flex flex-col bg-white">
        {/* 顶部 */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 md:px-6">
          {/* 手机菜单 */}
          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="
            md:hidden
            text-black
            text-2xl
          "
          >
            <FiMenu />
          </button>

          {/* 标题 */}
          <h1
            className="
            ml-4
            text-sm
            md:text-base
            font-semibold
            text-black
          "
          >
            AI Interview Assistant
          </h1>

          {/* 退出 */}
          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              navigate("/login");
            }}
            className="
            ml-auto
            text-sm
            text-gray-500
            hover:text-black
            transition
          "
          >
            退出登录
          </button>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div
              className="
              h-full
              flex
              items-center
              justify-center
              px-6
            "
            >
              <div className="max-w-3xl text-center">
                <h1
                  className="
                  text-4xl
                  md:text-6xl
                  font-semibold
                  tracking-tight
                  leading-tight
                  text-black
                  mb-6
                "
                >
                  AI Interview Assistant
                </h1>

                <p
                  className="
                  text-gray-500
                  text-base
                  md:text-lg
                  leading-8
                "
                >
                  输入岗位名称，AI 将自动生成面试题、
                  点评答案并给出优化建议
                </p>

                {/* 推荐卡片 */}
                <div
                  className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-4
                  mt-12
                "
                >
                  <button
                    onClick={() =>
                      sendMessage(
                        "React 前端开发岗位"
                      )
                    }
                    className="
                    border
                    border-gray-200
                    rounded-3xl
                    p-5
                    text-left
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                  >
                    <p className="font-medium mb-2">
                      Frontend Interview
                    </p>

                    <p
                      className="
                      text-sm
                      opacity-70
                    "
                    >
                      React / TypeScript
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        "Node.js 后端开发岗位"
                      )
                    }
                    className="
                    border
                    border-gray-200
                    rounded-3xl
                    p-5
                    text-left
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                  >
                    <p className="font-medium mb-2">
                      Backend Interview
                    </p>

                    <p
                      className="
                      text-sm
                      opacity-70
                    "
                    >
                      Node.js / Express
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      sendMessage(
                        "AI 算法工程师岗位"
                      )
                    }
                    className="
                    border
                    border-gray-200
                    rounded-3xl
                    p-5
                    text-left
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                  >
                    <p className="font-medium mb-2">
                      AI Interview
                    </p>

                    <p
                      className="
                      text-sm
                      opacity-70
                    "
                    >
                      LLM / Prompt
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8">
              {messages.map(
                (message, index) => (
                  <MessageBubble
                    key={index}
                    role={message.role}
                    content={message.content}
                    streaming={
                      loading &&
                      index ===
                      messages.length - 1 &&
                      message.role ===
                      "assistant"
                    }
                  />
                )
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              className="
              text-center
              text-gray-400
              text-sm
              py-4
            "
            >
              AI 思考中...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 输入框 */}
        <ChatInput
          onSend={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default ChatPage;