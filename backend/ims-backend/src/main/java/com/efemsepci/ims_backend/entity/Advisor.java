package com.efemsepci.ims_backend.entity;

import com.efemsepci.ims_backend.enums.Departments;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("Advisor")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Advisor extends User{
    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private Departments department;
}
