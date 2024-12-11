package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Internship;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.service.InternshipService;
import com.efemsepci.ims_backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @Autowired
    private SubmissionService submissionService;

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
}