import React from "react";
import "./RecommendationCard.css";

const RecommendationCard = ({ recommendations = [] }) => {
    if (!recommendations.length) {
        return null;
    }

    return (
        <div className="recommendation-card">
            <div className="recommendation-header">
                <div>
                    <h3>🤖 NEXUS Recommendations</h3>
                    <p>Personalized insights based on your activity</p>
                </div>
            </div>

            <div className="recommendation-list">
                {recommendations.map((recommendation, index) => (
                    <div
                        className="recommendation-item"
                        key={index}
                    >
                        <span className="recommendation-icon">
                            💡
                        </span>

                        <span>
                            {recommendation}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationCard;