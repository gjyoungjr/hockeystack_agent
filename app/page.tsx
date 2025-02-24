import { Chat } from "@/components/chat";
import { generateId } from "ai";

export default function Home() {
  return <Chat id={generateId()} />;
}
