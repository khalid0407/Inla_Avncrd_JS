import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import SideNav from "../nav/nav";
import { postMessages, getUserMessages, deleteMessages } from "../../services";
import "./Chat.css";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

function Chat({ setUser }) {
  const [sendMessage, setSendMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [error, setError] = useState(null);
  const [botAvatar] = useState(() => {
    let stored = sessionStorage.getItem("botAvatar");
    if (stored) return stored;
    const url = `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`;
    sessionStorage.setItem("botAvatar", url);
    return url;
  });

  const loggedInAvatar = sessionStorage.getItem("avatar") || "https://i.pravatar.cc/40";
  const jwtPayload = parseJwt(sessionStorage.getItem("jwtToken"));
  const realUsername = (jwtPayload?.username || "").trim().toLowerCase();

  useEffect(() => {
    async function fetchMessages() {
      try {
        let messages = await getUserMessages();
        messages = messages.map((msg) => {
          const msgUser = (msg.username || "").trim().toLowerCase();
          if (msgUser === realUsername) {
            return { ...msg, isUser: true, username: "You", avatar: loggedInAvatar };
          }
          return { ...msg, isUser: false, username: "SupportBot", avatar: msg.avatar || botAvatar };
        });
        setUserMessages(messages);
        setError(null);
      } catch {
        setError("Failed to fetch messages.");
      }
    }
    fetchMessages();
  }, [loggedInAvatar, realUsername, botAvatar]);

  async function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = sendMessage.trim();
    if (!trimmed) return;

    try {
      const tempId = Date.now().toString();
      const newMsg = { id: tempId, text: trimmed, createdAt: new Date().toISOString(), isUser: true, username: "You", avatar: loggedInAvatar };
      setUserMessages((prev) => [...prev, newMsg]);
      setSendMessage("");
      setError(null);

      const response = await postMessages(trimmed);
      const realId = response?.latestMessage?.id;
      if (realId) setUserMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, id: realId } : msg)));

      setTimeout(() => {
        const lower = trimmed.toLowerCase();
        let reply = "Jag förstår inte riktigt. Kan du förklara mer?";
        if (lower.includes("hej")) reply = "Hej! Hur kan jag hjälpa dig?";
        else if (lower.includes("hur mår du")) reply = "Jag mår bra, tack! Hur mår du?";
        else if (lower.includes("vad kan du")) reply = "Jag kan chatta med dig och svara på enkla frågor!";

        setUserMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: reply, createdAt: new Date().toISOString(), isUser: false, username: "SupportBot", avatar: botAvatar }]);
      }, 1000);
    } catch {
      setError("Failed to send message. Please try again.");
    }
  }

  async function handleDeleteMessage(msgId) {
    try {
      await deleteMessages(msgId);
      setUserMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      setError("Failed to delete message.");
    }
  }

  return (
    <div className="chat-page-root">
      <div className="chat-container">
        <h1>Chat</h1>
        <div className="messages-list" role="log" aria-live="polite">
          {userMessages.length === 0 ? (
            <p className="empty">No messages yet.</p>
          ) : (
            userMessages.map((message) => {
              const isUser = message.isUser;
              return (
                <div key={message.id} className={`message-row ${isUser ? "user-row" : "bot-row"}`}>
                  {isUser ? (
                    <>
                      <div className={`message-bubble ${isUser ? "user-message" : "other-message"}`}>
                        <p className="message-text">{message.text}</p>
                        <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <button className="delete-btn" onClick={() => handleDeleteMessage(message.id)} aria-label="Delete message" title="Delete message">×</button>
                      <img src={message.avatar} alt="Your avatar" className="avatar" onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/40")} />
                    </>
                  ) : (
                    <>
                      <img src={message.avatar} alt={`${message.username} avatar`} className="avatar" onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/40")} />
                      <div className={`message-bubble ${isUser ? "user-message" : "other-message"}`}>
                        <p className="message-text">{message.text}</p>
                        <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input">
          <input type="text" value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} placeholder="Type your message here..." className="chat-message-input" autoComplete="off" aria-label="Message" />
          <button type="submit" className="send-btn">Send</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      <SideNav setUser={setUser} />
    </div>
  );
}

export default Chat;
