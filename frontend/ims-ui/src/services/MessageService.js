import axios from "axios";

const MESSAGE_API_URL = "http://localhost:8080/api/messages";

class MessageService {
  sendMessage(senderId, receiverId, content) {
    return axios.post(
      MESSAGE_API_URL +
        "/send?senderId=" +
        senderId +
        "&receiverId=" +
        receiverId +
        "&content=" +
        content
    );
  }
  getUnreadMessages(userId) {
    return axios.get(MESSAGE_API_URL + "/unread/" + userId);
  }
  getReadMessages(userId) {
    return axios.get(MESSAGE_API_URL + "/read/" + userId);
  }
  markAsRead(messageId) {
    return axios.post(MESSAGE_API_URL + "/read/" + messageId);
  }
  deleteMessage(id) {
    return axios.delete(MESSAGE_API_URL + "/" + id);
  }
}

export default new MessageService();
