
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useWebSocket(eventId, token) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!eventId || !token) return;
    socketRef.current = io("/", {
      query: { eventId },
      auth: { token },
    });

    socketRef.current.on("feedback", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [eventId, token]);

  const sendFeedback = (feedback) => {
    socketRef.current.emit("feedback", feedback);
  };

  return { messages, sendFeedback };
}