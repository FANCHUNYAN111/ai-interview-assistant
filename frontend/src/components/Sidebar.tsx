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
      {/* 手机遮罩 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed md:relative z-50
          h-full w-64 bg-[#202123]
          transform transition-transform duration-300
          flex flex-col

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* 新聊天 */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full border border-gray-600 rounded-xl p-3 text-white hover:bg-gray-700"
          >
            + 新聊天
          </button>
        </div>

        {/* 会话列表 */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((item) => (
            <div
              key={item.id}
              className={`
                flex items-center justify-between
                p-4 text-white cursor-pointer
                hover:bg-[#2A2B32]

                ${
                  currentId === item.id
                    ? "bg-[#343541]"
                    : ""
                }
              `}
              onClick={() =>
                onSelect(item.id)
              }
            >
              <span className="truncate">
                {item.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  onDelete(item.id);
                }}
                className="text-xs text-red-400 hover:text-red-500"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;