package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Internship;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    public Internship createInternship(Submission submission) {
        Internship internship = new Internship();

        internship.setStudent(submission.getSender());
        internship.setStdName(submission.getStdName());
        internship.setStdSurname(submission.getStdSurname());
        internship.setStdId(submission.getStdId());
        internship.setPhoneNumber(submission.getPhoneNumber());
        internship.setBirthPlaceDate(submission.getBirthPlaceDate());
        internship.setDepartment(submission.getDepartment());
        internship.setCompletedCredit(submission.getCompletedCredit());
        internship.setGpa(submission.getGpa());
        internship.setInternshipType(submission.getInternshipType());
        internship.setVoluntaryOrMandatory(submission.getVoluntaryOrMandatory());
        internship.setGraduationStatus(submission.getGraduationStatus());
        internship.setSummerSchool(submission.getSummerSchool());
        internship.setDescription(submission.getDescription());

        internship.setCompanyName(submission.getCompanyName());
        internship.setAddress(submission.getAddress());
        internship.setInternDepartment(submission.getInternDepartment());
        internship.setStartDate(submission.getStartDate());
        internship.setEndDate(submission.getEndDate());
        internship.setInternshipDays(submission.getInternshipDays());
        internship.setCompanyPhoneNumber(submission.getCompanyPhoneNumber());
        internship.setSector(submission.getSector());
        internship.setPersonnelNumber(submission.getPersonnelNumber());
        internship.setDepartmentPersonnelNumber(submission.getDepartmentPersonnelNumber());
        internship.setDepartmentCENGNumber(submission.getDepartmentCENGNumber());
        internship.setInternAdvisorFullName(submission.getInternAdvisorFullName());
        internship.setInternAdvisorPhone(submission.getInternAdvisorPhone());
        internship.setInternAdvisorMail(submission.getInternAdvisorMail());
        internship.setInternAdvisorJob(submission.getInternAdvisorJob());
        internship.setInternshipTopic(submission.getInternshipTopic());

        internship.setIsEvaluationForm(null);
        internship.setIsReport(null);
        internship.setGrade(null);
        internship.setStatusDescription(null);

        return internshipRepository.save(internship);
    }

    public Optional<Internship> getInternshipById(Long id) {
        return internshipRepository.findById(id);
    }

    public List<Internship> getInternships() {
        return internshipRepository.findAll();
    }

    public Internship updateInternship(Long id, String isEvaluation, String isReport, String grade, String statusDescription){
        Internship internship = internshipRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Internship not exist!"));
        if (isEvaluation != null) {
            internship.setIsEvaluationForm(isEvaluation);
        }
        else{
            System.out.println("No is evaluation");
        }
        if (isReport != null) {
            internship.setIsReport(isReport);
        }
        if (grade != null) {
            internship.setGrade(grade);
        }
        if (statusDescription != null) {
            internship.setStatusDescription(statusDescription);
        }
        return internshipRepository.save(internship);
    }
}