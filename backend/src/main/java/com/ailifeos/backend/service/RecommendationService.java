package com.ailifeos.backend.service;

import com.ailifeos.backend.model.Expense;
import com.ailifeos.backend.model.Goal;
import com.ailifeos.backend.model.Task;
import com.ailifeos.backend.repository.ExpenseRepository;
import com.ailifeos.backend.repository.GoalRepository;
import com.ailifeos.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final ExpenseRepository expenseRepository;

    public List<String> generateRecommendations(Long userId) {

        List<String> recommendations = new ArrayList<>();

        List<Task> tasks = taskRepository.findByUserId(userId);
        List<Goal> goals = goalRepository.findByUserId(userId);
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        // =========================
        // TASK RECOMMENDATIONS
        // =========================

        long pendingTasks = tasks.stream()
                .filter(task ->
                        !"COMPLETED".equalsIgnoreCase(task.getStatus()))
                .count();

        if (pendingTasks >= 5) {
            recommendations.add(
                    "You have " + pendingTasks +
                    " pending tasks. Focus on your highest-priority task first."
            );
        } else if (pendingTasks > 0) {
            recommendations.add(
                    "You have " + pendingTasks +
                    " pending task(s). Try completing them today."
            );
        } else if (!tasks.isEmpty()) {
            recommendations.add(
                    "Great job! All your tasks are completed."
            );
        }

        // =========================
        // DEADLINE RECOMMENDATION
        // =========================

        LocalDate today = LocalDate.now();

        long upcomingTasks = tasks.stream()
                .filter(task -> task.getDueDate() != null)
                .filter(task ->
                        !"COMPLETED".equalsIgnoreCase(task.getStatus()))
                .filter(task ->
                        !task.getDueDate().isBefore(today))
                .count();

        if (upcomingTasks > 0) {
            recommendations.add(
                    "You have " + upcomingTasks +
                    " upcoming task deadline(s). Plan your day accordingly."
            );
        }

        // =========================
        // GOAL RECOMMENDATIONS
        // =========================

        if (!goals.isEmpty()) {

            double averageProgress = goals.stream()
                    .mapToInt(goal ->
                            goal.getProgress() == null
                                    ? 0
                                    : goal.getProgress())
                    .average()
                    .orElse(0);

            if (averageProgress < 30) {

                recommendations.add(
                        "Your average goal progress is low. "
                        + "Set aside some focused time today for your goals."
                );

            } else if (averageProgress < 70) {

                recommendations.add(
                        "Your goals are progressing steadily. "
                        + "Keep the momentum going."
                );

            } else {

                recommendations.add(
                        "Excellent goal progress! "
                        + "You're close to achieving your targets."
                );
            }
        }

        // =========================
        // EXPENSE RECOMMENDATIONS
        // =========================

        double totalExpenses = expenses.stream()
                .mapToDouble(expense ->
                        expense.getAmount() == null
                                ? 0
                                : expense.getAmount())
                .sum();

        if (totalExpenses > 0) {

            if (totalExpenses >= 5000) {

                recommendations.add(
                        "Your recorded expenses are ₹" +
                        String.format("%.0f", totalExpenses) +
                        ". Review your spending categories and identify areas to reduce."
                );

            } else {

                recommendations.add(
                        "You've recorded ₹" +
                        String.format("%.0f", totalExpenses) +
                        " in expenses. Keep tracking your spending consistently."
                );
            }
        }

        // =========================
        // DEFAULT RECOMMENDATION
        // =========================

        if (recommendations.isEmpty()) {

            recommendations.add(
                    "Start adding tasks, goals, and expenses "
                    + "so NEXUS can provide personalized recommendations."
            );
        }

        return recommendations;
    }
}