package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.InternshipStatus;
import com.efemsepci.ims_backend.enums.SubmissionStatus;
import com.efemsepci.ims_backend.repository.SubmissionRepository;
import com.efemsepci.ims_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public Submission makeSubmission(Long senderId, Long receiverId, MultipartFile file, Map<String, String> formData) throws IOException {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Submission submission = new Submission();
        submission.setSender(sender);
        submission.setReceiver(receiver);
        submission.setFileContent(file.getBytes());

        // Form verilerini atama
        submission.setStdFullName(formData.get("stdFullName"));
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
        submission.setInternshipTopic(formData.get("internshipTopic"));

        submission.setCreatedAt(LocalDateTime.now());
        submission.setAdvisorCheck(SubmissionStatus.UNCHECKED);
        submission.setSecretaryCheck(SubmissionStatus.UNCHECKED);
        return submissionRepository.save(submission);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getSubmissionsByReceiver(Long userId){
        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return submissionRepository.findByReceiver(receiver);
    }

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
}