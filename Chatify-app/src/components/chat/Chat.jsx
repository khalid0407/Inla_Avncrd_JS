import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import SideNav from "../nav/Nav";
import { postMessages, getUserMessages, deleteMessages } from "../../services";
import { mockMessages } from "../../mocks";
import "./Chat.css";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
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
    const randomId = Math.floor(Math.random() * 70) + 1;
    const url = `https://i.pravatar.cc/40?img=${randomId}`;
    sessionStorage.setItem("botAvatar", url);
    return url;
  });

  let loggedInAvatar = sessionStorage.getItem("avatar") || "https://i.pravatar.cc/40";
  const jwt = sessionStorage.getItem("jwtToken");
  const jwtPayload = parseJwt(jwt);
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
          return {
            ...msg,
            isUser: false,
            username: "SupportBot",
            avatar: msg.avatar || "https://i.pravatar.cc/40",
          };
        });
        setUserMessages(messages);
        setError(null);
      } catch {
        setUserMessages(mockMessages);
        setError(null);
      }
    }
    fetchMessages();
  }, [loggedInAvatar, realUsername]);

  async function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = sendMessage.trim();
    if (!trimmed) return;

    try {
      const tempId = Date.now().toString();
      const newMsg = {
        id: tempId,
        text: trimmed,
        createdAt: new Date().toISOString(),
        isUser: true,
        username: "You",
        avatar: loggedInAvatar,
      };
      setUserMessages((prev) => [...prev, newMsg]);
      setSendMessage("");

      setError(null);
      const response = await postMessages(trimmed);
      const realId = response?.latestMessage?.id;
      if (realId) {
        setUserMessages((prev) =>
          prev.map((msg, idx) => (idx === prev.length - 1 && msg.id === tempId ? { ...msg, id: realId } : msg))
        );
      }

      setTimeout(() => {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          text: "Auto-response: Thanks for your message!",
          createdAt: new Date().toISOString(),
          isUser: false,
          username: "SupportBot",
          avatar: botAvatar,
        };
        setUserMessages((prev) => [...prev, botMsg]);
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

  function sanitize(str) {
    return DOMPurify.sanitize(str);
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
                <div
                  key={message.id}
                  className={`message-row ${isUser ? "user-row" : "bot-row"}`}
                >
                  {isUser ? (
                    <>
                      <div className={`message-bubble ${isUser ? "user-message" : "other-message"}`}>
                        <p className="message-text">{sanitize(message.text)}</p>
                        <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
                      </div>

                      {/* Delete button moved outside the bubble */}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                        aria-label="Delete message"
                        title="Delete message"
                      >
                        ×
                      </button>

                      <img
                        src={message.avatar}
                        alt="Your avatar"
                        className="avatar"
                        onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/40")}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={message.avatar}
                        alt={`${message.username} avatar`}
                        className="avatar"
                        onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/40")}
                      />
                      <div className={`message-bubble ${isUser ? "user-message" : "other-message"}`}>
                        <p className="message-text">{sanitize(message.text)}</p>
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
          <input
            type="text"
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            placeholder="Type your message here..."
            className="chat-message-input"
            autoComplete="off"
            aria-label="Message"
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <SideNav setUser={setUser} />
    </div>
  );
}

export default Chat;