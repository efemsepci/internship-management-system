package com.efemsepci.ims_backend.repository;

import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByRole(Role role);
    User findByEmail(String email);
}
