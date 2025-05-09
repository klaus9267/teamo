import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../styles/resume/detail.css";
import { resumeApi, Resume } from "../../api/resume.ts";

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (id) {
          const data = await resumeApi.getResume(Number(id));
          setResume(data);
        }
        setLoading(false);
      } catch (err) {
        setError("자기소개서를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!resume) return <div>자기소개서를 찾을 수 없습니다.</div>;

  return (
    <div className="resume-detail-container">
      <div className="resume-header">
        <h1>{resume.title}</h1>
        <p className="resume-date">{resume.date}</p>
      </div>

      <div className="resume-content">
        <section className="skills-section">
          <h2>기술 스택</h2>
          <div className="skills-list">
            {resume.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="personality-section">
          <h2>성격</h2>
          <div className="personality-list">
            {resume.personality.map((trait, index) => (
              <span key={index} className="personality-tag">
                {trait}
              </span>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>내용</h2>
          <div className="content-text">{resume.content}</div>
        </section>
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
}
