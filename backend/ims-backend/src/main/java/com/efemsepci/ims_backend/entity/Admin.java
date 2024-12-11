package com.efemsepci.ims_backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("Admin")
public class Admin extends User{

}
