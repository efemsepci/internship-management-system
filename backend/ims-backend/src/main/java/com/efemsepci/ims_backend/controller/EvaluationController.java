package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.Evaluation;
import com.efemsepci.ims_backend.entity.Internship;
import com.efemsepci.ims_backend.service.EmailService;
import com.efemsepci.ims_backend.service.EvaluationService;
import com.efemsepci.ims_backend.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.getAllEvaluations();
        return new ResponseEntity<>(evaluations, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        Optional<Evaluation> evaluation = evaluationService.getEvaluationById(id);
        return evaluation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        Evaluation savedEvaluation = evaluationService.saveEvaluation(evaluation);
        return new ResponseEntity<>(savedEvaluation, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByUser(@PathVariable Long userId){
        List<Evaluation> evaluations = evaluationService.getByUserId(userId);
        return new ResponseEntity<>(evaluations, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        boolean deleted = evaluationService.deleteEvaluation(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/send-evaluation-link")
    public ResponseEntity<?> sendEvaluationLink(@RequestParam Long studentId, @RequestParam String coordinatorEmail) {

        String evaluationLink = "http://localhost:3000/evaluation-form?studentId=" + studentId;

        String subject = "Yeditepe Üniversitesi Bilgisayar Mühendisliği Bölümü Stajyer Değerlendirme Formu";
        String body = "Merhaba,\n\nLütfen bu linke tıklayarak öğrencinin değerlendirme formunu doldurun: " + evaluationLink;
        emailService.sendEmail(coordinatorEmail, subject, body);

        return ResponseEntity.ok("Evaluation form link sent.");
    }
}
