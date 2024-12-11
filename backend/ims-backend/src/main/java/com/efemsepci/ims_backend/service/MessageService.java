package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Message;
import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.MessageStatus;
import com.efemsepci.ims_backend.repository.MessageRepository;
import com.efemsepci.ims_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setStatus(MessageStatus.UNREAD);

        return messageRepository.save(message);
    }

    public List<Message> getMessages(Long userId, MessageStatus status) {
        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return messageRepository.findByReceiverAndStatus(receiver, status);
    }

    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        message.setStatus(MessageStatus.READ);
        messageRepository.save(message);
    }

    public void deleteMessageById(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new IllegalArgumentException("Message not found id: " + id);
        }
        messageRepository.deleteById(id);
    }
}
