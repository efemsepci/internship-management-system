package com.efemsepci.ims_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student", nullable = false)
    private Student student;

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

    private String isEvaluationForm;
    private String isReport;
    private String grade;
    private String statusDescription;
}
