import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { FiMenu } from "react-icons/fi";

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
        `/conversations/${conversationId}/messages`
      );

      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchConversations = async () => {
    try {
      const response =
        await api.get("/conversations");

      const data = response.data;

      setConversations(data);

      // 只初始化一次
      if (
        data.length > 0 &&
        !currentConversationId
      ) {
        const firstId = data[0].id;

        setCurrentConversationId(firstId);

        // 直接加载消息
        fetchMessages(firstId);
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
        await api.post("/conversations");

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
        `/conversations/${id}`
      );

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
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#343541] overflow-hidden">
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

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航 */}
        <div className="h-14 border-b border-gray-700 flex items-center px-4">
          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="md:hidden text-white text-2xl"
          >
            <FiMenu />
          </button>

          <h1 className="text-white font-bold ml-4">
            AI Interview Assistant
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              navigate("/login");
            }}
            className="ml-auto text-sm text-red-400 hover:text-red-500"
          >
            退出登录
          </button>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white text-3xl font-bold text-center px-4">
              AI Interview Assistant
            </div>
          ) : (
            messages.map(
              (message, index) => (
                <MessageBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              )
            )
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center text-gray-400 py-4">
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