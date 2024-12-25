package com.efemsepci.ims_backend.entity;

import com.efemsepci.ims_backend.enums.SubmissionStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Student sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileContent;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus advisorCheck;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus secretaryCheck;

    //student information
    private String stdName;
    private String stdSurname;
    private String stdId;
    private String phoneNumber;
    private String birthPlaceDate;
    private String department;
    private String completedCredit;
    private String gpa;
    private String internshipType;
    private String voluntaryOrMandatory;
    private String graduationStatus;
    private String summerSchool;
    private String description;

    //company information
    private String companyName;
    private String address;
    private String internDepartment;
    private String startDate;
    private String endDate;
    private String internshipDays;
    private String companyPhoneNumber;
    private String sector;
    private String personnelNumber;
    private String departmentPersonnelNumber;
    private String departmentCENGNumber;
    private String internAdvisorFullName;
    private String internAdvisorPhone;
    private String internAdvisorMail;
    private String internAdvisorJob;
    private String internshipTopic;

}
