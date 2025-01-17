package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Internship;
import com.efemsepci.ims_backend.entity.Student;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.service.InternshipService;
import com.efemsepci.ims_backend.service.SubmissionService;
import com.efemsepci.ims_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UserService userService;

    @PostMapping("/create/{submissionId}")
    public ResponseEntity<Internship> createInternship(@PathVariable Long submissionId) {
        Optional<Submission> optionalSubmission = submissionService.getSubmissionById(submissionId);

        if (optionalSubmission.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Submission submission = optionalSubmission.get();
        Internship internship = internshipService.createInternship(submission);

        return ResponseEntity.ok(internship);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        return internshipService.getInternshipById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Internship>> getInternships() {
        List<Internship> internships = internshipService.getInternships();
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/student/{id}")
    public List<Internship> getInternshipsByStudent(@PathVariable Long id) {
        ResponseEntity<User> response = userService.getUserById(id);
        if (response.getBody() == null) {
            throw new IllegalArgumentException("Student not found!");
        }
        User student = response.getBody();
        return internshipService.getInternshipByStudent((Student) student);
    }



    @PutMapping("/{id}")
    public ResponseEntity<Internship> updateInternship(
            @PathVariable Long id,
            @RequestParam(required = false) String isEvaluation,
            @RequestParam(required = false) String isReport,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String statusDescription) {
        Internship updatedInternship = internshipService.updateInternship(id, isEvaluation, isReport, grade, statusDescription);
        return ResponseEntity.ok(updatedInternship);
    }
}