interface MessageReactionsProps {
  reactions?: any[];
  variant: "sender" | "receiver";
}

export default function MessageReactions({
  reactions,
  variant,
}: MessageReactionsProps) {
  if (!reactions?.length) return null;

  return (
    <div
      className={`flex items-center gap-1 absolute -bottom-9 z-10 ${
        variant === "sender" ? "-left-2" : "-right-2"
      }`}
    >
      {reactions.map((react: any, idx: number) => (
        <span
          key={idx}
          className="px-1.5 py-0.5 rounded-full shadow-md bg-white text-black border border-gray-100 text-xs flex items-center gap-0.5"
        >
          <span>{react.reaction}</span>
          {react.count > 1 && (
            <span className="text-[10px] font-semibold text-gray-600">
              {react.count}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
