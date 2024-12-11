package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Message;
import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverAndStatus(User receiver, MessageStatus status);
}