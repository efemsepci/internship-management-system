package com.efemsepci.ims_backend.repository;


import com.efemsepci.ims_backend.entity.Evaluation;
import com.efemsepci.ims_backend.entity.Holidays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HolidaysRepository extends JpaRepository<Holidays, Long> {
}
