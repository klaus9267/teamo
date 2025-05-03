import React from "react";
import "../../styles/main/Main.css";

export default function PostDetailPage() {
  // 더미 데이터
  const leader = {
    name: "홍길동",
    image: "https://via.placeholder.com/48x48.png?text=User",
    email: "hong@sample.com",
  };
  const endDate = "2025-10-29";
  const techStack = ["React", "TypeScript", "Node.js"];

  return (
    <div className="post-detail-container" style={{ display: "flex", gap: 32 }}>
      {/* 왼쪽 본문 */}
      <div className="post-detail-main" style={{ flex: 1, minWidth: 0 }}>
        <h1>[서울] kettodaze - 일본 거주 매칭</h1>
        <div style={{ margin: "24px 0" }}>
          <b>모집 현황</b>
          <div style={{ marginTop: 8 }}>
            <span>프론트엔드 1/2</span> <span>백엔드 1/1</span>{" "}
            <span>디자이너 0/1</span>
          </div>
        </div>
        <div style={{ margin: "24px 0" }}>
          <b>소개</b>
          <p>
            일본 거주자를 위한 매칭 플랫폼 프로젝트입니다.
            <br />
            다양한 기술 스택과 협업 경험을 쌓을 수 있습니다.
          </p>
        </div>
      </div>
      {/* 오른쪽 고정 정보 */}
      <aside
        className="post-detail-aside"
        style={{
          width: 260,
          minWidth: 220,
          position: "sticky",
          top: 32,
          alignSelf: "flex-start",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={leader.image}
            alt="리더 프로필"
            style={{ width: 48, height: 48, borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{leader.name}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{leader.email}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 마감일</div>
          <div style={{ fontWeight: 600 }}>{endDate}</div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>기술 스택</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}
          >
            {techStack.map((tech) => (
              <span className="tech-tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
