export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 bg-[#F3F4F6] text-gray-500 px-3 py-3 rounded-xl rounded-tl-none w-fit text-xs animate-fade-in">
      <span className="flex gap-1 items-center">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.20s]" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
      </span>
    </div>
  );
}
