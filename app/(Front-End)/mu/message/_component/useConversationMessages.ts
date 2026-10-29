"use client";

import baseApiSlice from "@/feature/slice/baseApi";
import {
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useMarkReadMessageMutation,
} from "@/feature/slice/message/messageSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function useConversationMessages(
  conversationId: string,
  onLoaded?: (res: any) => void,
) {
  const dispatch = useDispatch();

  const [fetchMessages, { isFetching: isFetchingMore }] =
    useLazyGetConversationMessagesQuery();
  const [markReadMessage] = useMarkReadMessageMutation();

  const [conversation, setConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const isLoadingOlderRef = useRef(false);

  // Read RTK Query cache directly — if cached, skip refetch
  const cachedResult = useGetConversationMessagesQuery(conversationId, {
    skip: !conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;

    // Cache hit within 10 min → populate from cache, no flash, no API call
    if (cachedResult?.data && !cachedResult.isLoading) {
      const res = cachedResult.data as any;
      setConversation(res);
      setChatMessages(res?.data || []);
      setNextCursor(res?.next_cursor || null);
      setHasMore(Boolean(res?.has_more || res?.next_cursor));
      onLoaded?.(res);
      return;
    }

    // Cache miss → clear state and fetch from network
    setChatMessages([]);
    setNextCursor(null);
    setHasMore(false);

    let cancelled = false;
    fetchMessages(conversationId)
      .unwrap()
      .then((res: any) => {
        if (cancelled) return;
        setConversation(res);
        setChatMessages(res?.data || []);
        setNextCursor(res?.next_cursor || null);
        setHasMore(Boolean(res?.has_more || res?.next_cursor));
        onLoaded?.(res);
      })
      .catch((err) => console.error("Error fetching messages:", err));

    return () => {
      cancelled = true;
    };
  }, [conversationId, cachedResult?.data, cachedResult.isLoading, fetchMessages, onLoaded]);

  const appendMessage = useCallback((msg: any) => {
    if (!msg?.id) return;
    setChatMessages((prev) =>
      prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
    );
  }, []);

  const prependOlderMessages = useCallback((older: any[]) => {
    setChatMessages((prev) => {
      const existingIds = new Set(prev.map((m: any) => Number(m.id)));
      const uniqueOlder = older.filter(
        (m: any) => !existingIds.has(Number(m.id)),
      );
      return [...uniqueOlder, ...prev];
    });
  }, []);

  const replaceMessage = useCallback((tempId: number, msg: any) => {
    setChatMessages((prev) => prev.map((m) => (m.id === tempId ? msg : m)));
  }, []);

  const removeMessage = useCallback((tempId: number) => {
    setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
  }, []);

  const updateMessageReactions = useCallback(
    (messageId: any, reactions: any[]) => {
      setChatMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)),
      );
    },
    [],
  );

  const markConversationRead = useCallback(
    async (conversationIdToMark: any) => {
      await markReadMessage(conversationIdToMark).unwrap();
      dispatch(baseApiSlice.util.invalidateTags(["conversationList"]));
    },
    [dispatch, markReadMessage],
  );

  const loadOlderPage = useCallback(
    async (cursor: string) => {
      if (isLoadingOlderRef.current) return null;

      isLoadingOlderRef.current = true;
      try {
        const res: any = await fetchMessages({
          id: conversationId,
          cursor,
        }).unwrap();

        if (!res?.data?.length) {
          setHasMore(false);
        } else {
          setNextCursor(res?.next_cursor || null);
          setHasMore(Boolean(res?.has_more || res?.next_cursor));
        }

        return res;
      } catch (err) {
        console.error("Failed to load older messages", err);
        return null;
      } finally {
        isLoadingOlderRef.current = false;
      }
    },
    [conversationId, fetchMessages],
  );

  return {
    conversation,
    chatMessages,
    isFetchingMore,
    nextCursor,
    hasMore,
    appendMessage,
    prependOlderMessages,
    replaceMessage,
    removeMessage,
    updateMessageReactions,
    markConversationRead,
    loadOlderPage,
  };
}
