"use client";

import { CHAT_ID } from "@/lib/constants";
import { useChat } from "ai/react";
import { ChatMessages } from "./chat-message";
import { ChatPanel } from "./chat-panel";
// import { User } from "@releef.ai/types";

export function Chat({
  id,
  // savedMessages = [],
  query,
}: // user,
{
  id: string;
  // savedMessages?: Message[];
  query?: string;
  // user: Pick<User, "name">;
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    append,
    data,
    setData,
  } = useChat({
    // initialMessages: savedMessages,
    id: CHAT_ID,
    // body: {
    //   id,
    // },
    // onFinish: () => {
    //   window.history.replaceState({}, "", `/search/${id}`);
    // },
    onError: (error) => {
      console.log("Error in chat", error);
      // toast.error(`Error in chat: ${error.message}`);
    },
    sendExtraMessageFields: false, // Disable extra message fields
  });

  // useEffect(() => {
  //   setMessages(savedMessages);
  // }, [id]);

  const onQuerySelect = (query: string) => {
    append({
      role: "user",
      content: query,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setData(undefined); // reset data to clear tool call
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl pt-14 pb-60 mx-auto stretch">
      <ChatMessages
        messages={messages}
        data={data}
        onQuerySelect={onQuerySelect}
        isLoading={isLoading}
        chatId={id}
      />
      <ChatPanel
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        stop={stop}
        query={query}
        append={append}
      />
    </div>
  );
}
