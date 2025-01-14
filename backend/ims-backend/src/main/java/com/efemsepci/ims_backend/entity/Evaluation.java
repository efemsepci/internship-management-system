package com.efemsepci.ims_backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    //student information
    private String stdName;
    private String stdSurname;

    //company information
    private String companyName;
    private String address;
    private String internDepartment;
    private String companyPhoneNumber;
    private String sector;
    private String departmentCENGNumber;
    private String internAdvisorFullName;
    private String internAdvisorPhone;
    private String internAdvisorMail;
    private String internAdvisorJob;
    private String companySize;
    private String workDone;
    private String internshipPlace;
    private List<String> evaluations;
    private List<String> questions;
    private String opinion;
    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime history;
}
