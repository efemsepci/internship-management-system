package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
}
