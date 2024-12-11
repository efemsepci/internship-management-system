package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Message;
import com.efemsepci.ims_backend.enums.MessageStatus;
import com.efemsepci.ims_backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long senderId, @RequestParam Long receiverId, @RequestParam String content) {
        return messageService.sendMessage(senderId, receiverId, content);
    }

    @GetMapping("/unread/{userId}")
    public List<Message> getUnreadMessages(@PathVariable Long userId) {
        return messageService.getMessages(userId, MessageStatus.UNREAD);
    }

    @GetMapping("/read/{userId}")
    public List<Message> getReadMessages(@PathVariable Long userId){
        return messageService.getMessages(userId, MessageStatus.READ);
    }

    @PostMapping("/read/{messageId}")
    public void markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessageById(id);
            return ResponseEntity.ok("Message deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
