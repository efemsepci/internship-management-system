package com.efemsepci.ims_backend.service;

import com.efemsepci.ims_backend.entity.User;
import com.efemsepci.ims_backend.enums.Role;
import com.efemsepci.ims_backend.exception.ResourceNotFoundException;
import com.efemsepci.ims_backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public List<User> findAll(){
        return userRepository.findAll();
    }
    public User saveUser(User user){
        return userRepository.save(user);
    }
    public ResponseEntity<User> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exist with id: " + id));
        return ResponseEntity.ok(user);
    }
    public List<User> getUserByRole(Role role){
        return userRepository.findByRole(role);
    }

    public User getUserByEmail(String email){ return userRepository.findByEmail(email); }
    public ResponseEntity<Map<String,Boolean>> deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exist with id: " + id));
        userRepository.delete(user);
        Map<String,Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
