package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Internship;
import com.efemsepci.ims_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByStudent(Student student);
}
