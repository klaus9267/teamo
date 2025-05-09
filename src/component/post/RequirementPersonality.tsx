import React from "react";
import "../../styles/post/TeamMembers.css";

interface RequirementPersonalityProps {
  personality?: string;
}

const RequirementPersonality: React.FC<RequirementPersonalityProps> = ({
  personality,
}) => {
  return (
    <div className="team-members-section">
      <h3 className="team-title">필요한 성향</h3>
      <div className="member-card">
        <div className="member-info">
          <div className="content-text" style={{ whiteSpace: "pre-line" }}>
            {personality || "특별히 필요한 성향이 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementPersonality;
