package com.efemsepci.ims_backend.controller;

import com.efemsepci.ims_backend.entity.*;
import com.efemsepci.ims_backend.enums.Role;
import com.efemsepci.ims_backend.service.MessageService;
import com.efemsepci.ims_backend.service.SubmissionService;
import com.efemsepci.ims_backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/usr")
@AllArgsConstructor
public class UserController {

    private UserService userService;
    private MessageService messageService;
    private SubmissionService submissionService;

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.findAll();
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @PostMapping("/users/student")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        User savedUser = userService.saveUser(student);
        return ResponseEntity.status(HttpStatus.CREATED).body((Student) savedUser);
    }
    @PostMapping("/users/advisor")
    public ResponseEntity<Advisor> createAdvisor(@RequestBody Advisor advisor) {
        User savedUser = userService.saveUser(advisor);
        return ResponseEntity.status(HttpStatus.CREATED).body((Advisor) savedUser);
    }
    @PostMapping("/users/secretary")
    public ResponseEntity<Secretary> createSecretary(@RequestBody Secretary secretary) {
        User savedUser = userService.saveUser(secretary);
        return ResponseEntity.status(HttpStatus.CREATED).body((Secretary) savedUser);
    }
    @PostMapping("/users/admin")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        User savedUser = userService.saveUser(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body((Admin) savedUser);
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String,Boolean>> deleteUser(@PathVariable Long id) {
        submissionService.deleteSubmissionsForUser(id);
        messageService.deleteMessagesForUser(id);
        return userService.deleteUserById(id);
    }
    @GetMapping("/users/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role) {
        return userService.getUserByRole(role);
    }

    @GetMapping("/users/email/{email}")
    public User getUserByEmail(@PathVariable String email){return userService.getUserByEmail(email);}
}
