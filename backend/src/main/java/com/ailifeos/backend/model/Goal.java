package com.ailifeos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDate targetDate;

    private Integer progress = 0;

    @Column(nullable = false)
    private String status = "IN_PROGRESS";

    private Long userId;
}