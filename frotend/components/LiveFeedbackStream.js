
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";

export default function LiveFeedbackStream({ eventId }) {
  const { token } = useContext(AuthContext);
  const { messages, sendFeedback } = useWebSocket(eventId, token);
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState("");

  const handleSend = () => {
    if (input || emoji) {
      sendFeedback({ comment: input, emoji });
      setInput("");
      setEmoji("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.emoji && <span>{msg.emoji}</span>} {msg.comment}
          </div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Comment..." />
      <button onClick={() => setEmoji("👍")}>👍</button>
      <button onClick={() => setEmoji("👎")}>👎</button>
      <button onClick={() => setEmoji("❤️")}>❤️</button>
      <button onClick={() => setEmoji("😮")}>😮</button>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}