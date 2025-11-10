import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const isRestaurantQuery =
        input.toLowerCase().includes("nhà hàng") ||
        input.toLowerCase().includes("tiệc") ||
        input.toLowerCase().includes("quán") ||
        input.toLowerCase().includes("wedding");

      const endpoint = isRestaurantQuery
        ? "http://localhost:5000/api/ai/suggest"
        : "http://localhost:5000/api/chat";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.reply, data: data.data || [] };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Xin lỗi, tôi không thể phản hồi lúc này." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (id) => {
    setIsOpen(false); // đóng chatbox
    navigate(`/restaurant/${id}`);
  };

  return (
    <div style={styles.container}>
      {!isOpen && (
        <button style={styles.toggleButton} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <span style={{ fontWeight: "600" }}>AI Assistant</span>
            <button style={styles.closeButton} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageWrapper,
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    backgroundColor:
                      msg.role === "user" ? "#007bff" : "#f1f0f0",
                    color: msg.role === "user" ? "white" : "black",
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                  {/* ✅ Danh sách nhà hàng */}
                  {msg.role === "ai" && msg.data?.length > 0 && (
                    <div style={styles.cardContainer}>
                      {msg.data.map((r, index) => (
                        <div
                          key={index}
                          style={styles.restaurantCard}
                          onClick={() => handleRestaurantClick(r.restaurantID)}
                        >
                          <img
                            src={r.thumbnailURL}
                            alt={r.name}
                            style={styles.thumbnail}
                          />
                          <div>
                            <div style={styles.cardTitle}>{r.name}</div>
                            <div style={styles.cardSub}>
                              ⭐ {r.avgRating ?? "N/A"} | {r.totalReviews ?? 0}{" "}
                              đánh giá
                            </div>
                            <div style={styles.cardDesc}>
                              {r.description}
                            </div>
                            <div style={styles.cardAddr}>
                              {r.fullAddress}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}
              >
                <div style={styles.loadingBubble}>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={styles.sendButton}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 },
  toggleButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "26px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  chatBox: {
    width: "360px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    color: "white",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    backgroundColor: "#fafafa",
  },
  messageWrapper: { display: "flex", width: "100%" },
  messageBubble: {
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "15px",
    lineHeight: "1.4",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  cardContainer: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  restaurantCard: {
    display: "flex",
    gap: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  cardTitle: { fontWeight: "bold", fontSize: "14px" },
  cardSub: { fontSize: "12px", color: "#555" },
  cardDesc: { fontSize: "13px", color: "#333" },
  cardAddr: { fontSize: "12px", color: "#777" },
  inputArea: { display: "flex", padding: "10px", borderTop: "1px solid #ddd" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  sendButton: {
    marginLeft: "8px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0 14px",
    cursor: "pointer",
  },
  loadingBubble: {
    display: "flex",
    gap: "4px",
    backgroundColor: "#f1f0f0",
    borderRadius: "15px",
    padding: "8px 12px",
  },
  dot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#999",
    borderRadius: "50%",
    animation: "blink 1.4s infinite both",
  },
};
