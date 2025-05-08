import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/resume/detail.css";

// 더미 데이터 - 실제로는 API나 전역 상태에서 가져와야 함
const dummyResumeList = [
  {
    id: 1,
    title: "웹 개발자 지원 자기소개서",
    content:
      "안녕하세요, 웹 개발자로 지원하는 리박스입니다. React와 TypeScript를 활용한 프로젝트 경험이 풍부하며, 협업을 중요시합니다.",
    date: "2023-04-25",
    skills: ["React", "TypeScript", "JavaScript", "HTML/CSS"],
    personality: "협업 중심의 개발자 | 문제 해결 능력 | 긍정적인 태도",
  },
  {
    id: 2,
    title: "프론트엔드 개발자 자기소개서",
    content:
      "안녕하세요. 3년차 웹 개발자 김지원입니다. 프론트엔드의 백엔드 모두 경험이 있으며, 특히 React와 Node.js를 활용한 프로젝트에 강점이 있습니다.",
    date: "2023-06-30",
    skills: ["React", "Node.js", "TypeScript", "Express"],
    personality: "꼼꼼한 문서화 | 사용자 중심 설계 | 지속적인 학습과 개선",
  },
];

const ResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API 호출이 필요함
    const fetchResume = () => {
      setLoading(true);
      const foundResume = dummyResumeList.find(
        (item) => item.id === parseInt(id || "0")
      );

      setTimeout(() => {
        if (foundResume) {
          setResume(foundResume);
        }
        setLoading(false);
      }, 500); // 로딩 시뮬레이션
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="resume-detail-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="resume-detail-container">
        <div className="error-message">
          <h2>자기소개서를 찾을 수 없습니다.</h2>
          <button onClick={() => navigate("/profile")} className="back-btn">
            프로필로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-detail-container">
      <div className="resume-detail-header">
        <Link to="/profile" className="back-link">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          프로필로 돌아가기
        </Link>
        <h1>{resume.title}</h1>
        <div className="resume-meta">
          <span className="resume-date">작성일: {resume.date}</span>
        </div>
      </div>

      <div className="resume-detail-content">
        <div className="resume-section">
          <h3>기술 스택</h3>
          <div className="resume-skills">
            {resume.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="resume-section">
          <h3>성향 및 성격</h3>
          <p className="resume-personality">{resume.personality}</p>
        </div>

        <div className="resume-section">
          <h3>자기소개서 내용</h3>
          <div className="resume-content">
            {resume.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="resume-actions">
        <button
          className="edit-btn"
          onClick={() => navigate(`/profile/resume/edit/${resume.id}`)}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default ResumeDetail;
