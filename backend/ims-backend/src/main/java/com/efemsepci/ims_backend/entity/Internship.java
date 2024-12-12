package com.efemsepci.ims_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    //student information
    private String stdFullName;
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
    private String internshipTopic;

    private String isEvaluationForm;
    private String isReport;
    private String grade;
}
