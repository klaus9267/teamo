import React from 'react';
import '../../styles/post/TeamMembers.css';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner.tsx';

interface MemberType {
  id?: number;
  name?: string;
  avatar?: string;
  email?: string;
  isLeader?: boolean;
  skills?: string[];
}

interface TeamMembersProps {
  leader?: MemberType;
  members?: MemberType[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ leader, members }) => {
  const teamMembers = members ?? [];

  if (!leader) {
    return (
      <div className="team-members-section">
        <h3 className="team-title">팀 정보</h3>
        <div className="member-card">
          <div
            className="member-info"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px 0',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            아직 팀원이 없습니다
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-members-section">
      <h3 className="team-title">팀 리더</h3>
      <div className="member-card leader-card">
        <Link
          to={`/profile/${leader.id ?? 0}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            width: '100%',
          }}
        >
          <div className="member-avatar-container">
            <img src={leader.avatar ?? '/assets/default-avatar.png'} alt={leader.name ?? '팀장'} className="member-avatar" />
          </div>
          <div className="member-info">
            <div className="member-name">{leader.name ?? '팀장'}</div>
          </div>
        </Link>
      </div>

      {teamMembers.length > 0 && (
        <>
          <h3 className="team-title">멤버</h3>
          <div className="members-list">
            {teamMembers.map((member: MemberType) => (
              <div key={member?.id ?? Math.random()} className="member-card">
                <Link
                  to={`/profile/${member?.id ?? 0}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                  }}
                >
                  <div className="member-avatar-container">
                    <img src={member?.avatar ?? '/assets/default-avatar.png'} alt={member?.name ?? '멤버'} className="member-avatar" />
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member?.name ?? '멤버'}</div>
                    <div className="member-skills">
                      {member?.skills?.map((skill, index) => (
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
