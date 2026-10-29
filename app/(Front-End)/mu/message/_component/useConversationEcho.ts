"use client";

import echo from "@/lib/echo";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseConversationEchoArgs {
  conversationId: string;
  onMessageSent: (data: any) => void | Promise<void>;
  onReactionChanged: (data: any) => void;
}

export function useConversationEcho({
  conversationId,
  onMessageSent,
  onReactionChanged,
}: UseConversationEchoArgs) {
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingAtRef = useRef(0);

  useEffect(() => {
    if (!echo || !conversationId) return;

    const channelName = `conversation.${conversationId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = async (data: any) => {
      await onMessageSent(data);
      setIsOtherUserTyping(false);
    };

    const handleTypingEvent = () => {
      setIsOtherUserTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsOtherUserTyping(false);
      }, 2500);
    };

    channel.listen(".MessageSent", handleMessageSent);
    channel.listen(".MessageReactionChanged", onReactionChanged);
    channel.listenForWhisper("typing", handleTypingEvent);

    return () => {
      channel.stopListening(".MessageSent", handleMessageSent);
      channel.stopListening(".MessageReactionChanged", onReactionChanged);
      channel.stopListeningForWhisper("typing", handleTypingEvent);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      echo.leave(channelName);
    };
  }, [conversationId, onMessageSent, onReactionChanged]);

  const whisperTyping = useCallback(() => {
    if (!echo || !conversationId) return;
    const now = Date.now();
    if (now - lastTypingAtRef.current > 1000) {
      lastTypingAtRef.current = now;
      echo
        .private(`conversation.${conversationId}`)
        .whisper("typing", { typing: true });
    }
  }, [conversationId]);

  return { isOtherUserTyping, whisperTyping };
}
