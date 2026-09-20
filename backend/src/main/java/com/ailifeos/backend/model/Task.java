package com.ailifeos.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDate dueDate;

    @Column(nullable = false)
    private String status = "PENDING";

    // User selected priority
    @Column(nullable = false)
    private String priority = "MEDIUM";

    // System calculated priority
    private String smartPriority = "MEDIUM";

    private Long userId;
}