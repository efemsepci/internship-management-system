package com.efemsepci.ims_backend.entity;

import com.efemsepci.ims_backend.enums.Departments;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("Secretary")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Secretary extends User{
    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private Departments department;
}
