import {
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSend: (message: string) => void;

  loading: boolean;
}

function ChatInput({
  onSend,
  loading,
}: Props) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const [input, setInput] =
    useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);

    setInput("");

    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* 输入框 */}
        <div
          className="
          border border-gray-300
          rounded-3xl
          px-4 py-4
          flex items-end gap-4
          bg-white
          shadow-sm
          hover:shadow-md
          transition
        "
        >
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();

                if (!loading) {
                  handleSend();
                }
              }
            }}
            placeholder="输入岗位，例如：React 前端开发岗位"

          />

          {/* 发送按钮 */}
          <Button
            onClick={handleSend}
            disabled={loading}

          >
            →
          </Button>
        </div>

        {/* 底部提示 */}
        <p
          className="
          text-center
          text-xs
          text-gray-400
          mt-3
          leading-6
        "
        >
          AI may produce inaccurate
          information. Verify important
          details before use.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;