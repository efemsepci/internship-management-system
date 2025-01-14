package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Student;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.SubmissionStatus;
import com.efemsepci.ims_backend.repository.SubmissionRepository;
import com.efemsepci.ims_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    public Submission makeSubmission(Long senderId, Long receiverId, Map<String, String> formData) throws IOException {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Submission submission = new Submission();
        submission.setSender((Student) sender);
        submission.setReceiver(receiver);

        // Form verilerini atama
        submission.setStdName(formData.get("stdName"));
        submission.setStdSurname(formData.get("stdSurname"));
        submission.setStdId(formData.get("stdId"));
        submission.setPhoneNumber(formData.get("phoneNumber"));
        submission.setBirthPlaceDate(formData.get("birthPlaceDate"));
        submission.setDepartment(formData.get("department"));
        submission.setCompletedCredit(formData.get("completedCredit"));
        submission.setGpa(formData.get("gpa"));
        submission.setInternshipType(formData.get("internshipType"));
        submission.setVoluntaryOrMandatory(formData.get("voluntaryOrMandatory"));
        submission.setGraduationStatus(formData.get("graduationStatus"));
        submission.setSummerSchool(formData.get("summerSchool"));
        submission.setDescription(formData.get("description"));
        submission.setCompanyName(formData.get("companyName"));
        submission.setAddress(formData.get("address"));
        submission.setInternDepartment(formData.get("internDepartment"));
        submission.setStartDate(formData.get("startDate"));
        submission.setEndDate(formData.get("endDate"));
        submission.setInternshipDays(formData.get("internshipDays"));
        submission.setCompanyPhoneNumber(formData.get("companyPhoneNumber"));
        submission.setSector(formData.get("sector"));
        submission.setPersonnelNumber(formData.get("personnelNumber"));
        submission.setDepartmentPersonnelNumber(formData.get("departmentPersonnelNumber"));
        submission.setDepartmentCENGNumber(formData.get("departmentCENGNumber"));
        submission.setInternAdvisorFullName(formData.get("internAdvisorFullName"));
        submission.setInternAdvisorPhone(formData.get("internAdvisorPhone"));
        submission.setInternAdvisorMail(formData.get("internAdvisorMail"));
        submission.setInternAdvisorJob(formData.get("internAdvisorJob"));
        submission.setInternshipTopic(formData.get("internshipTopic"));

        submission.setCreatedAt(LocalDateTime.now());
        submission.setAdvisorCheck(SubmissionStatus.UNCHECKED);
        submission.setSecretaryCheck(SubmissionStatus.UNCHECKED);
        return submissionRepository.save(submission);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> findAllSubmission(){
        return submissionRepository.findAll();
    }

    public List<Submission> getSubmissionsByReceiver(Long userId){
        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return submissionRepository.findByReceiver(receiver);
    }

    public List<Submission> getSubmissionsBySender(Long userId){
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return submissionRepository.findBySender(sender);
    }

    public Submission saveSubmission(Submission submission){ return submissionRepository.save(submission); }

    public void markAsCheckedAdvisor(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        submission.setAdvisorCheck(SubmissionStatus.CHECKED);
        submissionRepository.save(submission);
    }

    public void markAsCheckedSecretary(Long submissionId){
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        submission.setSecretaryCheck(SubmissionStatus.CHECKED);
        submissionRepository.save(submission);
    }

    public void deleteSubmissionById(Long id) {
        if (!submissionRepository.existsById(id)) {
            throw new IllegalArgumentException("Submission not found id: " + id);
        }
        submissionRepository.deleteById(id);
    }

    @Transactional
    public void deleteSubmissionsForUser(Long userId) {
        submissionRepository.deleteBySenderId(userId);
        submissionRepository.deleteByReceiverId(userId);
    }
}
