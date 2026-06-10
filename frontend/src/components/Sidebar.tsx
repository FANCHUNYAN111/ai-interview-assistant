import { FiPlus } from "react-icons/fi";

import { Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
interface Props {
  conversations: any[];

  currentId: string;

  onSelect: (id: string) => void;

  onNewChat: () => void;

  onDelete: (id: string) => void;

  mobileOpen: boolean;

  onClose: () => void;
}

function Sidebar({
  conversations,
  currentId,
  onSelect,
  onNewChat,
  onDelete,
  mobileOpen,
  onClose,
}: Props) {
  return (
    <>
      {/* 手机端 */}
      <Sheet
        open={mobileOpen}
        onOpenChange={onClose}
      >
        <SheetContent
          side="left"
          className="
          p-0
          w-72
          bg-[#fafafa]
          border-r
        "
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div
              className="
              h-16
              flex items-center
              px-5
              border-b
              text-lg
              font-semibold
            "
            >
              AI Interview
            </div>

            {/* New Chat */}
            <div className="p-4">
              <button
                onClick={onNewChat}
                className="
                w-full
                h-12
                rounded-2xl
                border
                hover:bg-black
                hover:text-white
                transition
                text-sm
                font-medium
                flex items-center
                justify-center
                gap-2
              "
              >
                <FiPlus />
                New Chat
              </button>
            </div>

            {/* Conversations */}
            <div
              className="
              flex-1
              overflow-y-auto
              px-3
              pb-4
              space-y-2
            "
            >
              {conversations.map(
                (item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      onSelect(item.id)
                    }
                    className={`
                    group
                    w-full
                    text-left
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    transition
                    flex items-center justify-between
                    cursor-pointer

                    ${currentId ===
                        item.id
                        ? "bg-black text-white"
                        : "hover:bg-gray-100 text-black"
                      }
                  `}
                  >
                    <span className="truncate">
                      {item.title}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        onDelete(item.id);
                      }}
                      className={`
                      opacity-0
                      group-hover:opacity-100
                      transition

                      ${currentId ===
                          item.id
                          ? "text-white"
                          : "text-gray-400"
                        }
                    `}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* PC端 */}
      <div
        className="
        hidden md:flex
        h-full w-72
        bg-[#fafafa]
        border-r border-gray-200
        flex-col
      "
      >
        {/* Logo */}
        <div
          className="
          h-16
          flex items-center
          px-5
          border-b border-gray-200
          text-lg
          font-semibold
        "
        >
          AI Interview
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="
            w-full
            h-12
            rounded-2xl
            border border-gray-300
            hover:bg-black
            hover:text-white
            transition
            text-sm
            font-medium
            flex items-center
            justify-center
            gap-2
          "
          >
            <FiPlus />
            New Chat
          </button>
        </div>

        {/* Conversations */}
        <div
          className="
          flex-1
          overflow-y-auto
          px-3
          pb-4
          space-y-2
        "
        >
          {conversations.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                onSelect(item.id)
              }
              className={`
              group
              w-full
              text-left
              rounded-2xl
              px-4
              py-3
              text-sm
              transition
              flex items-center justify-between
              cursor-pointer

              ${currentId === item.id
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-black"
                }
            `}
            >
              <span className="truncate">
                {item.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  onDelete(item.id);
                }}
                className={`
                opacity-0
                group-hover:opacity-100
                transition

                ${currentId === item.id
                    ? "text-white"
                    : "text-gray-400"
                  }
              `}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;