import ReactMarkdown from "react-markdown";

interface Props {
  role: "user" | "assistant";

  content: string;
}

function MessageBubble({
  role,
  content,
}: Props) {
  return (
    <div
      className={`w-full py-6
        ${
          role === "assistant"
            ? "bg-[#444654]"
            : "bg-[#343541]"
        }
      `}
    >
      <div className="max-w-3xl mx-auto px-4 text-white">
        {/* markdown 渲染 */}
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default MessageBubble;