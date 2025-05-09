import React from "react";
import "../../styles/post/TeamMembers.css";

interface ProjectTypeProps {
  type?: string;
}

const ProjectType: React.FC<ProjectTypeProps> = ({ type }) => {
  const getTypeLabel = (type: string | undefined) => {
    switch (type) {
      case "ONLINE":
        return "온라인";
      case "OFFLINE":
        return "오프라인";
      case "MIX":
        return "온라인 + 오프라인 혼합";
      default:
        return "미정";
    }
  };

  return (
    <div className="team-members-section">
      <h3 className="team-title">진행 방식</h3>
      <div className="member-card">
        <div className="member-info">
          <div className="content-text">{getTypeLabel(type)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectType;
