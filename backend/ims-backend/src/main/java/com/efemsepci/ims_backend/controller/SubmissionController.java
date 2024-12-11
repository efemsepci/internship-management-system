package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Documents;
import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.service.SubmissionService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/make")
    public ResponseEntity<Submission> makeSubmission(
            @RequestParam("senderId") Long senderId,
            @RequestParam("receiverId") Long receiverId,
            @RequestPart("file") MultipartFile file,
            @RequestPart("formValues") String formValuesJson) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> formValues = objectMapper.readValue(formValuesJson, new TypeReference<Map<String, String>>() {});

        Submission submission = submissionService.makeSubmission(senderId, receiverId, file, formValues);
        return ResponseEntity.ok(submission);
    }

    @PostMapping("/{submissionId}/advisor")
    public void advisorApprove(@PathVariable Long submissionId){
        submissionService.markAsCheckedAdvisor(submissionId);
    }

    @PostMapping("/{submissionId}/secretary")
    public void secretaryApprove(@PathVariable Long submissionId){
        submissionService.markAsCheckedSecretary(submissionId);
    }

    @GetMapping("/{userId}")
    public List<Submission> getSubmissions(@PathVariable Long userId){
        return submissionService.getSubmissionsByReceiver(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubmission(@PathVariable Long id) {
        try {
            submissionService.deleteSubmissionById(id);
            return ResponseEntity.ok("Submisson deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadSubmissionFile(@PathVariable Long id) throws UnsupportedEncodingException {
        Submission submission = submissionService.getSubmissionById(id).orElse(null);

        if (submission == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        byte[] fileContent = submission.getFileContent();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF); // Dosya türüne göre değiştirin
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("submission_" + id + ".pdf")
                .build());

        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }
}
