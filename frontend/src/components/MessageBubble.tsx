import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { motion } from "framer-motion";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  role: "user" | "assistant";

  content: string;

  streaming?: boolean;
}

function MessageBubble({
  role,
  content,
  streaming,
}: Props) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        max-w-4xl
        mx-auto
        px-4
        py-4
      "
    >
      <div
        className={`
          flex
          ${
            isUser
              ? "justify-end"
              : "justify-start"
          }
        `}
      >
        <div
          className={`
            max-w-[90%]
            md:max-w-3xl
            rounded-3xl
            px-5
            py-4
            text-sm
            md:text-[15px]
            leading-8
            shadow-sm

            ${
              isUser
                ? `
                  bg-black
                  text-white
                `
                : `
                  bg-[#f7f7f8]
                  text-black
                  border border-gray-200
                `
            }
          `}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const {
                  children,
                  className,
                } = props;

                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                return match ? (
                  <div className="my-4 overflow-hidden rounded-2xl border border-gray-200">
                    <SyntaxHighlighter
                      style={oneLight}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(
                        children
                      ).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className={`
                      px-1.5 py-0.5 rounded
                      text-sm

                      ${
                        isUser
                          ? "bg-white/20"
                          : "bg-gray-200"
                      }
                    `}
                  >
                    {children}
                  </code>
                );
              },

              p({ children }) {
                return (
                  <p className="mb-4 last:mb-0">
                    {children}
                  </p>
                );
              },

              ul({ children }) {
                return (
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    {children}
                  </ul>
                );
              },

              ol({ children }) {
                return (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    {children}
                  </ol>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>

          {/* 流式光标 */}
          {role === "assistant" &&
            streaming && (
              <span className="animate-pulse ml-1">
                ▋
              </span>
            )}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;