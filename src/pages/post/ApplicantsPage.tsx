import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 자기소개서 타입 정의
interface Resume {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  skills: string[];
  traits: string;
}

// 더미 자기소개서 목록 (실제로는 API에서 가져옴)
const dummyResumes: Resume[] = [
  {
    id: 1,
    title: "프론트엔드 개발자 자기소개서",
    content:
      "안녕하세요, 웹 개발자로 지원하는 리박스입니다. React와 TypeScript를 활용한 프로젝트 경험이 풍부하며, 협업을 중요시합니다.",
    createdAt: "2023-04-25",
    skills: ["React", "TypeScript", "JavaScript", "HTML/CSS"],
    traits: "협업 중심의 개발자 | 문제 해결 능력 | 긍정적인 태도",
  },
  {
    id: 2,
    title: "백엔드 개발자 자기소개서",
    content: "Node.js와 Express를 활용한 API 개발 경험이 있습니다.",
    createdAt: "2023-05-15",
    skills: ["Node.js", "Express", "MongoDB"],
    traits: "논리적 사고 | 책임감 | 꼼꼼함",
  },
  {
    id: 3,
    title: "디자이너 자기소개서",
    content: "UI/UX 디자인 경험이 있으며 사용자 중심의 디자인을 추구합니다.",
    createdAt: "2023-06-01",
    skills: ["Figma", "Adobe XD", "Photoshop"],
    traits: "창의성 | 소통 능력 | 트렌드 파악",
  },
];

// 지원자 타입 정의 (motivation, resumeId 추가)
interface Applicant {
  id: number;
  name: string;
  avatar: string;
  applyDate: string;
  skills: string[];
  resumeId: number; // 선택한 자기소개서 id
  motivation: string; // 지원동기
  aiScore: number;
  aiReason: string;
  portfolioUrl?: string;
  position: string;
  location: string;
}

// 더미 지원자 데이터
const dummyApplicants: Applicant[] = [
  {
    id: 5,
    name: "김서연",
    avatar: "https://via.placeholder.com/48x48.png?text=Kim",
    applyDate: "2025-04-28",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    resumeId: 1,
    motivation: "사용자 경험을 개선하는데 기여하고 싶어서 지원했습니다.",
    aiScore: 98,
    aiReason:
      "React와 TypeScript를 활용한 실시간 변경 기능 개발 경험이 있어 프로젝트에 빨리 기여할 것으로 예상됩니다. 학습과 성장에 대한 의지가 높고, 팀 프로젝트의 목표와 방향성에 공감하고 있습니다.",
    portfolioUrl: "https://portfolio.example.com/kim",
    position: "프론트엔드 개발자",
    location: "서울",
  },
  {
    id: 6,
    name: "이준호",
    avatar: "https://via.placeholder.com/48x48.png?text=Lee",
    applyDate: "2025-04-27",
    skills: ["Figma", "Adobe XD", "Prototype", "Principle"],
    resumeId: 3,
    motivation: "팀 프로젝트에서 다양한 협업 경험을 쌓고 싶어서 지원했습니다.",
    aiScore: 92,
    aiReason:
      "다양한 협업 경험과 학습에 대한 의지가 높아 팀 프로젝트에 긍정적인 시너지를 낼 것으로 기대됩니다.",
    portfolioUrl: "https://portfolio.example.com/lee",
    position: "UI/UX 디자이너",
    location: "경기",
  },
  {
    id: 7,
    name: "박지훈",
    avatar: "https://via.placeholder.com/48x48.png?text=Park",
    applyDate: "2025-04-26",
    skills: ["JavaScript", "Sass", "Redux"],
    resumeId: 1,
    motivation: "신입 프론트엔드 엔지니어로 성장하고 싶어서 지원했습니다.",
    aiScore: 88,
    aiReason:
      "React와 TypeScript를 활용한 실시간 변경 기능 개발 경험이 있어 프로젝트에 빨리 기여할 것으로 예상됩니다.",
    portfolioUrl: "https://portfolio.example.com/park",
    position: "프론트엔드 개발자",
    location: "인천",
  },
];

export default function ApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(
    dummyApplicants[0].id
  );
  const [showResumeModal, setShowResumeModal] = useState(false);
  const selectedApplicant = dummyApplicants.find((a) => a.id === selectedId);
  const selectedResume = dummyResumes.find(
    (r) => r.id === selectedApplicant?.resumeId
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f7f8fa" }}>
      {/* 지원자 리스트 */}
      <div
        style={{
          width: 380,
          background: "#fff",
          borderRight: "1px solid #eee",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: 24,
            fontWeight: 700,
            fontSize: 20,
            color: "#3cb4ac",
          }}
        >
          지원자 매칭
        </div>
        {dummyApplicants.map((applicant) => (
          <div
            key={applicant.id}
            onClick={() => setSelectedId(applicant.id)}
            style={{
              padding: 20,
              borderBottom: "1px solid #f0f0f0",
              background: selectedId === applicant.id ? "#e0f7f5" : "#fff",
              cursor: "pointer",
              borderLeft:
                selectedId === applicant.id
                  ? "6px solid #3cb4ac"
                  : "6px solid transparent",
              transition: "background 0.2s, border-left 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={applicant.avatar}
                alt={applicant.name}
                style={{ width: 48, height: 48, borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{applicant.name}</div>
                <div style={{ fontSize: 12, color: "#bbb" }}>
                  {applicant.applyDate}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e0f7f5",
                    color: "#3cb4ac",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 12,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
              <b style={{ color: "#3cb4ac", fontWeight: 500 }}>지원동기: </b>
              {applicant.motivation}
            </div>
          </div>
        ))}
      </div>

      {/* 지원자 상세 */}
      <div style={{ flex: 1, padding: 40, overflowY: "auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 24,
            background: "none",
            border: "none",
            color: "#3cb4ac",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ← 게시글로 돌아가기
        </button>
        {selectedApplicant && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              padding: 36,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={selectedApplicant.avatar}
                alt={selectedApplicant.name}
                style={{ width: 64, height: 64, borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>
                  {selectedApplicant.name}
                </div>
                <div style={{ fontSize: 13, color: "#bbb" }}>
                  지원일: {selectedApplicant.applyDate}
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#888" }}>AI 추천 점수</div>
                <div
                  style={{ fontWeight: 700, fontSize: 24, color: "#3cb4ac" }}
                >
                  {selectedApplicant.aiScore}
                </div>
              </div>
            </div>
            <div
              style={{ margin: "24px 0 12px 0", fontWeight: 600, fontSize: 17 }}
            >
              기술 스택
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {selectedApplicant.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#e0f7f5",
                    color: "#3cb4ac",
                    borderRadius: 4,
                    padding: "4px 12px",
                    fontSize: 14,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
            <div style={{ margin: "18px 0 8px 0", fontWeight: 600 }}>
              AI 추천 이유
            </div>
            <div
              style={{
                background: "#f7f8fa",
                borderRadius: 6,
                padding: 16,
                color: "#444",
                marginBottom: 18,
              }}
            >
              {selectedApplicant.aiReason}
            </div>
            <div style={{ margin: "18px 0 8px 0", fontWeight: 600 }}>
              지원동기
            </div>
            <div
              style={{
                background: "#f7f8fa",
                borderRadius: 6,
                padding: 16,
                color: "#444",
                marginBottom: 18,
              }}
            >
              {selectedApplicant.motivation}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowResumeModal(true)}
                style={{
                  background: "#3cb4ac",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "8px 18px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                자기소개서
              </button>
              <button
                onClick={() => navigate(`/profile/${selectedApplicant.id}`)}
                style={{
                  background: "#eee",
                  color: "#3cb4ac",
                  borderRadius: 6,
                  padding: "8px 18px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                상세 프로필
              </button>
            </div>
          </div>
        )}
        {showResumeModal && selectedApplicant && selectedResume && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowResumeModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 32,
                minWidth: 350,
                maxWidth: 500,
                boxShadow: "0 2px 16px #0002",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowResumeModal(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  color: "#3cb4ac",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <h2
                style={{
                  color: "#3cb4ac",
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 8,
                }}
              >
                {selectedResume.title}
              </h2>
              <div style={{ color: "#888", fontSize: 14, marginBottom: 18 }}>
                작성일: {selectedResume.createdAt}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  기술 스택
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedResume.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: "#e0f7f5",
                        color: "#3cb4ac",
                        borderRadius: 4,
                        padding: "4px 12px",
                        fontSize: 14,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  성향 및 성격
                </div>
                <div style={{ color: "#444" }}>{selectedResume.traits}</div>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                자기소개서 내용
              </div>
              <div style={{ color: "#444", whiteSpace: "pre-line" }}>
                {selectedResume.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
