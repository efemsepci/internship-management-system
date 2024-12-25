package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.Evaluation;
import com.efemsepci.ims_backend.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    public Evaluation saveEvaluation(Evaluation evaluation) {
        evaluation.setHistory(LocalDateTime.now());
        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Optional<Evaluation> getEvaluationById(Long id) {
        return evaluationRepository.findById(id);
    }

    public boolean deleteEvaluation(Long id) {
        Optional<Evaluation> evaluationOpt = evaluationRepository.findById(id);
        if (evaluationOpt.isPresent()) {
            evaluationRepository.delete(evaluationOpt.get());
            return true;
        } else {
            return false;
        }
    }

    public List<Evaluation> getByUserId(Long userId){
        return evaluationRepository.findByUserId(userId);
    }
}
