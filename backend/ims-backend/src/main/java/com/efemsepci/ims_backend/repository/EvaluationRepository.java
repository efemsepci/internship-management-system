package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByUserId(Long userId);
}
