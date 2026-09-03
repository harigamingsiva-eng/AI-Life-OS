package com.ailifeos.backend.service;

import com.ailifeos.backend.model.Goal;
import com.ailifeos.backend.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public List<Goal> getGoalsByUser(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal updateProgress(Long id, Integer progress) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setProgress(progress);
        if (progress >= 100) {
            goal.setStatus("COMPLETED");
        }
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
