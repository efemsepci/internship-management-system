package com.efemsepci.ims_backend.entity;

import com.efemsepci.ims_backend.enums.MessageStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User receiver;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageStatus status;
}

