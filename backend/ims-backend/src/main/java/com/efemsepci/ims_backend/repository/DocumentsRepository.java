package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentsRepository extends JpaRepository<Documents, Long> {
    Documents findByFileName(String name);
}
