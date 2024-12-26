import React, { useState, useEffect } from "react";
import "../style/messagesPages.css";
import MessageService from "../services/MessageService";
import UserService from "../services/UserService";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isOldMessagesModalOpen, setIsOldMessagesModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    MessageService.getUnreadMessages(user.id)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error, can not load messages!", error);
      });

    if (user.role === "ADMIN") {
      UserService.getUsers()
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error, can not load users!", error);
        });
    } else if (user.role === "ADVISOR") {
      Promise.all([
        UserService.getUserByRole("STUDENT"),
        UserService.getUserByRole("SECRETARY"),
      ])
        .then(([studentResponse, secretaryResponse]) => {
          const allUsers = [...studentResponse.data, ...secretaryResponse.data];
          setUsers(allUsers);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } else if (user.role === "SECRETARY") {
      UserService.getUserByRole("ADVISOR")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error, can not load users!", error);
        });
    } else if (user.role === "STUDENT") {
      UserService.getUserByRole("ADVISOR")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error, can not load users!", error);
        });
    }
  }, [user.id]);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setReplyText("");
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      MessageService.sendMessage(
        selectedMessage.receiver.id,
        selectedMessage.sender.id,
        replyText
      )
        .then(() => {
          setReplyText("");
          setSelectedMessage(null);
          MessageService.markAsRead(selectedMessage.id);
        })
        .catch((error) => {
          console.error("Error, can not send reply!", error);
        });
    } else {
      alert("Please write a reply!");
    }
  };

  const handleSendNewMessage = () => {
    if (selectedUser && newMessage.trim()) {
      MessageService.sendMessage(user.id, selectedUser, newMessage)
        .then(() => {
          setNewMessage("");
          setSelectedUser("");
          setIsNewMessageModalOpen(false);
        })
        .catch((error) => {
          console.error("Error, can not send message!", error);
        });
    } else {
      alert("Please select a user and write a message!");
    }
  };

  const handleFetchOldMessages = () => {
    if (selectedUser) {
      MessageService.getReadMessages(user.id, selectedUser)
        .then((response) => {
          setOldMessages(response.data);
        })
        .catch((error) => {
          console.error("Error, can not fetch old messages!", error);
        });
    } else {
      alert("Please select a user!");
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.surname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-container">
      <div className="messages-list">
        <h3>Messages</h3>
        <ul>
          {messages.map((message) => (
            <li key={message.id} onClick={() => handleMessageClick(message)}>
              <strong>
                {message.sender.name} {message.sender.surname}
              </strong>
              <p>{message.createdAt}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsNewMessageModalOpen(true)}
          className="new-old-message-btn"
        >
          New Message
        </button>
        <button
          style={{ marginLeft: 10 }}
          onClick={() => setIsOldMessagesModalOpen(true)}
          className="new-old-message-btn"
        >
          Old Messages
        </button>
      </div>

      <div className="message-detail">
        {selectedMessage ? (
          <div>
            <h4>Reply to: {selectedMessage.sender.name}</h4>
            <p>{selectedMessage.content}</p>
            <textarea
              value={replyText}
              onChange={handleReplyChange}
              placeholder="Write your reply..."
            ></textarea>
            <button onClick={handleSendReply}>Send Reply</button>
          </div>
        ) : (
          <h3>Select a message to reply</h3>
        )}
      </div>
      {isNewMessageModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>New Message</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your message..."
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSendNewMessage}>Send</button>
              <button onClick={() => setIsNewMessageModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isOldMessagesModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Old Messages</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setOldMessages([]);
              }}
            >
              <option value="">Select User</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleFetchOldMessages}>Show Messages</button>
              <ul>
                {oldMessages.map((message) => (
                  <li key={message.id}>
                    <strong>
                      {message.createdAt} {message.sender.name}:
                    </strong>{" "}
                    {message.content}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsOldMessagesModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
