import React, { useState, useEffect } from "react";
import "../../styles/main/Main.css";

// 배너 데이터
const bannerData = [
  {
    id: 1,
    title: "AI 추천 시스템",
    subtitle:
      "자기소개서와 기술 스택을 분석하여 프로젝트에 가장 적합한 팀원을 추천해드립니다.",
    color: "#2196f3", // 파란색
  },
  {
    id: 2,
    title: "성향 매칭 분석",
    subtitle:
      "기술적 역량뿐만 아니라 팀원 간의 성향과 작업 스타일을 고려한 매칭을 제공합니다.",
    color: "#4caf50", // 초록색
  },
  {
    id: 3,
    title: "포트폴리오 관리",
    subtitle:
      "프로젝트 경험과 팀 활동을 자동으로 포트폴리오에 기록하고 관리할 수 있습니다.",
    color: "#ffd700", // 노란색
  },
];

// 모집 글 더미 데이터
const recruitmentPosts = [
  {
    id: 1,
    title: "아이디어는 있지만 참여자가 없다구요?",
    category: "프로젝트",
    techStack: ["React", "TypeScript", "Node.js"],
    status: {
      current: 2,
      total: 4,
    },
  },
  {
    id: 2,
    title: "투표와 기술대회 사업화전략 플랫폼",
    category: "공모전",
    techStack: ["Spring", "Java", "MySQL"],
    status: {
      current: 3,
      total: 5,
    },
  },
  {
    id: 3,
    title: "[서울] kettodaze - 일본 거주 매칭",
    category: "해커톤",
    techStack: ["Flutter", "Firebase", "Python"],
    status: {
      current: 1,
      total: 3,
    },
  },
  {
    id: 4,
    title: "[서울] kettodaze - 일본 거주 매칭",
    category: "스터디",
    techStack: ["Flutter", "Firebase", "Python"],
    status: {
      current: 2,
      total: 6,
    },
  },
  {
    id: 5,
    title: "[서울] kettodaze - 일본 거주 매칭",
    category: "스터디",
    techStack: ["Flutter", "Firebase", "Python"],
    status: {
      current: 2,
      total: 6,
    },
  },
];

export default function HomePage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const changeBanner = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const getOrderedBanners = () => {
    const orderedBanners = [...bannerData];
    const rotateCount = bannerData.length - currentBannerIndex;
    for (let i = 0; i < rotateCount; i++) {
      const lastBanner = orderedBanners.pop();
      if (lastBanner) {
        orderedBanners.unshift(lastBanner);
      }
    }
    return orderedBanners;
  };

  return (
    <div className="home-container">
      <section className="banner-section">
        <div className="banner-left">
          <div className="banner-text">
            <h1>팀원 준비 완료!</h1>
            <h2>팀워크가 필요할 때, Teamo</h2>
          </div>
        </div>

        <div className="banner-stack">
          {getOrderedBanners().map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-card ${
                isTransitioning ? "transitioning" : ""
              } ${
                index === bannerData.length - 1
                  ? "front"
                  : index === bannerData.length - 2
                  ? "middle"
                  : "back"
              }`}
              style={{
                backgroundColor: banner.color,
                transform: `translateY(${-index * 20}px) scale(${
                  index === bannerData.length - 1
                    ? 1
                    : index === bannerData.length - 2
                    ? 0.95
                    : 0.9
                })`,
                zIndex: index,
              }}
            >
              <div className="banner-card-content">
                <h3>{banner.title}</h3>
                <p>{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="banner-dots">
          {bannerData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentBannerIndex ? "active" : ""}`}
              onClick={() => changeBanner(index)}
            />
          ))}
        </div>
      </section>

      <section className="recruitment-section">
        <div className="category-filter-row">
          <div className="category-filters">
            {["전체", "프로젝트", "공모전", "해커톤", "스터디"].map(
              (category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
        <div className="recruitment-row-bottom">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">진행 방식</option>
            <option value="online">온라인</option>
            <option value="offline">오프라인</option>
            <option value="hybrid">혼합</option>
          </select>
          <label className="checkbox-label">
            <input type="checkbox" />
            모집중
          </label>
        </div>

        <div className="recruitment-list">
          {recruitmentPosts.map((post) => (
            <div key={post.id} className="recruitment-card">
              <div className="recruitment-image">
                <span className="recruitment-category">{post.category}</span>
              </div>
              <div className="recruitment-content">
                <h3>{post.title}</h3>
                <div className="recruitment-meta">
                  <div className="tech-stack">
                    {post.techStack.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="recruitment-stats">
                  <span className="status">
                    <span className="status-text">모집 완료</span>
                    {post.status.current}/{post.status.total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
