import React from "react";
import "../../styles/post/TeamMembers.css";
import { Link } from "react-router-dom";

interface MemberType {
  id: number;
  name: string;
  avatar: string;
  email?: string;
  isLeader?: boolean;
  skills?: string[];
}

interface TeamMembersProps {
  leader: MemberType;
  members: MemberType[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ leader, members }) => {
  return (
    <div className="team-members-section">
      <h3 className="team-title">팀 리더</h3>
      <div className="member-card leader-card">
        <Link
          to={`/profile/${leader.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            width: "100%",
          }}
        >
          <div className="member-avatar-container">
            <img
              src={leader.avatar}
              alt={leader.name}
              className="member-avatar"
            />
          </div>
          <div className="member-info">
            <div className="member-name">{leader.name}</div>
          </div>
        </Link>
      </div>

      {members.length > 0 && (
        <>
          <h3 className="team-title">멤버</h3>
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <Link
                  to={`/profile/${member.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <div className="member-avatar-container">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="member-avatar"
                    />
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-skills">
                      {member.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamMembers;
