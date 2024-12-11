package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Submission;
import com.efemsepci.ims_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByReceiver(User receiver);
}
