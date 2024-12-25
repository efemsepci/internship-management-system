package com.efemsepci.ims_backend.entity;

import com.efemsepci.ims_backend.enums.Departments;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("Student")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Student extends User{
    @Column(name = "student_id")
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private Departments department;
}
