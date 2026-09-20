package com.ailifeos.backend.service;

import com.ailifeos.backend.model.Expense;
import com.ailifeos.backend.model.Goal;
import com.ailifeos.backend.model.Task;
import com.ailifeos.backend.repository.ExpenseRepository;
import com.ailifeos.backend.repository.GoalRepository;
import com.ailifeos.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductivityScoreService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final ExpenseRepository expenseRepository;

    public int calculateScore(Long userId) {

        // =========================
        // 1. TASK SCORE - 40%
        // =========================

        List<Task> tasks = taskRepository.findByUserId(userId);

        double taskScore = 0;

        if (!tasks.isEmpty()) {
            long completedTasks = tasks.stream()
                    .filter(task ->
                            "COMPLETED".equalsIgnoreCase(task.getStatus()))
                    .count();

            taskScore =
                    ((double) completedTasks / tasks.size()) * 100;
        }

        // =========================
        // 2. GOAL SCORE - 40%
        // =========================

        List<Goal> goals = goalRepository.findByUserId(userId);

        double goalScore = 0;

        if (!goals.isEmpty()) {
            goalScore = goals.stream()
                    .mapToInt(goal ->
                            goal.getProgress() == null
                                    ? 0
                                    : goal.getProgress())
                    .average()
                    .orElse(0);
        }

        // =========================
        // 3. EXPENSE SCORE - 20%
        // =========================

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        double expenseScore;

        if (expenses.isEmpty()) {
            expenseScore = 100;
        } else {
            // Basic expense-management score.
            // This can be improved later when budget
            // functionality is added.
            expenseScore = 70;
        }

        // =========================
        // FINAL SCORE
        // =========================

        double finalScore =
                (taskScore * 0.4)
                + (goalScore * 0.4)
                + (expenseScore * 0.2);

        return (int) Math.round(finalScore);
    }
}