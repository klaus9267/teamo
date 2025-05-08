import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// 데이터 타입 정의
interface PostData {
  id: number;
  title: string;
  category: string;
  techStack: string[];
  status: {
    current: number;
    total: number;
  };
  endDate: string;
  meetingType: string;
}

// 모집 글 더미 데이터 (상세 페이지와 일치)
const recruitmentPostsData: PostData[] = [
  {
    id: 1,
    title: "[서울] Kettodze - 일본 가챠 매장",
    category: "프로젝트",
    techStack: [
      "React",
      "TypeScript",
      "Styled-Components",
      "NodeJS",
      "MongoDB",
    ],
    status: {
      current: 3,
      total: 5,
    },
    endDate: "2024.12.31",
    meetingType: "온라인",
  },
  {
    id: 2,
    title: "투표와 기술대회 사업화전략 플랫폼",
    category: "공모전",
    techStack: ["Spring", "Java", "MySQL", "React", "AWS"],
    status: {
      current: 2,
      total: 5,
    },
    endDate: "2025.05.06",
    meetingType: "혼합",
  },
  {
    id: 3,
    title: "AI 기반 추천 시스템 개발",
    category: "해커톤",
    techStack: ["Python", "TensorFlow", "MongoDB", "Flask", "AWS"],
    status: {
      current: 2,
      total: 4,
    },
    endDate: "2025.05.07",
    meetingType: "온라인",
  },
  {
    id: 4,
    title: "UX/UI 개선 프로젝트 팀원 모집",
    category: "스터디",
    techStack: ["Figma", "Adobe XD", "Sketch"],
    status: {
      current: 2,
      total: 6,
    },
    endDate: "2025.05.08",
    meetingType: "오프라인",
  },
  {
    id: 5,
    title: "쇼핑몰 마케팅 전략 기획 스터디",
    category: "스터디",
    techStack: ["Google Analytics", "SEO", "Marketing"],
    status: {
      current: 4,
      total: 8,
    },
    endDate: "2025.06.01",
    meetingType: "온라인",
  },
  {
    id: 6,
    title: "블록체인 기반 NFT 마켓플레이스",
    category: "프로젝트",
    techStack: ["Solidity", "Web3.js", "React"],
    status: {
      current: 3,
      total: 5,
    },
    endDate: "2024.08.10",
    meetingType: "온라인",
  },
  {
    id: 7,
    title: "클라우드 환경 CI/CD 파이프라인 구축",
    category: "프로젝트",
    techStack: ["AWS", "Docker", "Jenkins"],
    status: {
      current: 2,
      total: 4,
    },
    endDate: "2024.07.30",
    meetingType: "온라인",
  },
  {
    id: 8,
    title: "AI 기반 추천 시스템 개발",
    category: "해커톤",
    techStack: ["Python", "TensorFlow", "MongoDB"],
    status: {
      current: 3,
      total: 6,
    },
    endDate: "2024.08.05",
    meetingType: "온라인",
  },
  {
    id: 9,
    title: "모바일 앱 UX 개선 프로젝트",
    category: "프로젝트",
    techStack: ["Swift", "Kotlin", "Figma"],
    status: {
      current: 2,
      total: 5,
    },
    endDate: "2024.08.15",
    meetingType: "오프라인",
  },
  {
    id: 10,
    title: "웹 성능 최적화 스터디",
    category: "스터디",
    techStack: ["JavaScript", "Webpack", "Lighthouse"],
    status: {
      current: 4,
      total: 8,
    },
    endDate: "2024.07.25",
    meetingType: "온라인",
  },
  {
    id: 11,
    title: "오픈소스 프로젝트 기여 모임",
    category: "스터디",
    techStack: ["Git", "GitHub", "JavaScript"],
    status: {
      current: 5,
      total: 10,
    },
    endDate: "2024.08.20",
    meetingType: "온라인",
  },
  {
    id: 12,
    title: "데이터 시각화 대시보드",
    category: "프로젝트",
    techStack: ["D3.js", "React", "Python"],
    status: {
      current: 2,
      total: 4,
    },
    endDate: "2024.07.10",
    meetingType: "온라인",
  },
  {
    id: 13,
    title: "크로스 플랫폼 모바일 앱 개발",
    category: "해커톤",
    techStack: ["React Native", "Firebase", "Redux"],
    status: {
      current: 3,
      total: 6,
    },
    endDate: "2024.06.28",
    meetingType: "오프라인",
  },
  {
    id: 14,
    title: "마이크로서비스 아키텍처 스터디",
    category: "스터디",
    techStack: ["Docker", "Kubernetes", "Spring Boot"],
    status: {
      current: 4,
      total: 8,
    },
    endDate: "2024.07.12",
    meetingType: "온라인",
  },
  {
    id: 15,
    title: "IoT 스마트홈 프로젝트",
    category: "프로젝트",
    techStack: ["Arduino", "Raspberry Pi", "MQTT"],
    status: {
      current: 2,
      total: 5,
    },
    endDate: "2024.08.25",
    meetingType: "온라인",
  },
  {
    id: 16,
    title: "AI 이미지 생성 웹 서비스",
    category: "프로젝트",
    techStack: ["Python", "PyTorch", "React"],
    status: {
      current: 3,
      total: 6,
    },
    endDate: "2024.07.20",
    meetingType: "온라인",
  },
  {
    id: 17,
    title: "블록체인 기반 투표 시스템",
    category: "공모전",
    techStack: ["Ethereum", "Solidity", "Web3.js"],
    status: {
      current: 2,
      total: 4,
    },
    endDate: "2024.08.30",
    meetingType: "온라인",
  },
  {
    id: 18,
    title: "AR/VR 게임 개발 프로젝트",
    category: "프로젝트",
    techStack: ["Unity", "C#", "ARKit"],
    status: {
      current: 3,
      total: 6,
    },
    endDate: "2024.07.18",
    meetingType: "오프라인",
  },
  {
    id: 19,
    title: "프로그래밍 언어 스터디",
    category: "스터디",
    techStack: ["Go", "Rust", "TypeScript"],
    status: {
      current: 5,
      total: 10,
    },
    endDate: "2024.08.15",
    meetingType: "온라인",
  },
  {
    id: 20,
    title: "보안 취약점 분석 프로젝트",
    category: "해커톤",
    techStack: ["Python", "Burp Suite", "Metasploit"],
    status: {
      current: 2,
      total: 5,
    },
    endDate: "2024.07.30",
    meetingType: "오프라인",
  },
];

export default function HomePage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const lastPausedTimeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 16;
  const navigate = useNavigate();
  const [isRecruiting, setIsRecruiting] = useState(false);

  // 배너 전환 함수
  const rotateBanner = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 200);
  };

  // 마우스를 뗐을 때 즉시 슬라이더 업데이트
  const handleMouseLeave = () => {
    setIsPaused(false);

    // 마지막으로 일시정지된 시간을 확인하고 일정 시간이 지났으면 즉시 전환
    const now = Date.now();
    if (lastPausedTimeRef.current && now - lastPausedTimeRef.current > 2000) {
      rotateBanner();
    }
  };

  // 마우스를 올렸을 때 마지막 일시정지 시간 저장
  const handleMouseEnter = () => {
    setIsPaused(true);
    lastPausedTimeRef.current = Date.now();
  };

  useEffect(() => {
    // 일시정지 상태가 아닐 때만 인터벌 설정
    if (!isPaused) {
      intervalRef.current = setInterval(rotateBanner, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused]);

  // 필터링된 모집글 게시물 가져오기
  const getFilteredPosts = () => {
    let filteredPosts = [...recruitmentPostsData];
    if (selectedCategory !== "전체") {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (selectedStatus) {
      // 진행 방식 필터링 로직 (실제 데이터에 맞게 추가)
    }

    // 모집중 체크 시 마감일이 오늘 이전인 글은 제외
    if (isRecruiting) {
      const today = new Date();
      filteredPosts = filteredPosts.filter((post) => {
        // 마감일이 YYYY.MM.DD 또는 YYYY-MM-DD 형식일 수 있음
        const dateStr = post.endDate.replace(/\./g, "-");
        const deadline = new Date(dateStr);
        // 오늘 날짜 포함(마감일 당일까지 모집중)
        return (
          deadline >=
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
        );
      });
    }

    return filteredPosts;
  };

  // 현재 페이지에 표시할 게시물
  const getCurrentPagePosts = () => {
    const filteredPosts = getFilteredPosts();
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  // 페이지 변경 처리
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 상단으로 스크롤
    const recruitmentSection = document.querySelector(".recruitment-section");
    if (recruitmentSection) {
      window.scrollTo({
        top: (recruitmentSection as HTMLElement).offsetTop || 0,
        behavior: "smooth",
      });
    }
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const filteredPosts = getFilteredPosts();
    const totalPages = Math.ceil(filteredPosts.length / postPerPage);

    if (totalPages <= 1) return null;

    // 표시할 페이지 번호 계산 (최대 5개)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // 마지막 페이지가 totalPages보다 작으면 startPage 조정
    if (endPage < totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    return (
      <div className="pagination">
        <button
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        <div className="pagination-numbers">
          {startPage > 1 && (
            <>
              <button
                className="pagination-number"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <button
              key={startPage + i}
              className={`pagination-number ${
                currentPage === startPage + i ? "active" : ""
              }`}
              onClick={() => handlePageChange(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-number"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className={`pagination-btn ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

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

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus]);

  const currentPosts = getCurrentPagePosts();

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
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

        <div
          className="banner-stack"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
            <input
              type="checkbox"
              checked={isRecruiting}
              onChange={(e) => setIsRecruiting(e.target.checked)}
            />
            모집중
          </label>
        </div>

        <div className="recruitment-list">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="recruitment-card"
              onClick={() => handlePostClick(post.id)}
              style={{ cursor: "pointer" }}
            >
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
                  <div className="recruitment-status-container">
                    <div className="status">
                      <span className="status-text">모집 현황:</span>
                      <span>
                        {post.status.current}/{post.status.total}
                      </span>
                    </div>
                    <div className="deadline">
                      <span className="deadline-text">마감일:</span>
                      <span className="deadline-date">{post.endDate}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>
                    <span
                      style={{
                        display: "inline-block",
                        border: `1.5px solid ${
                          post.meetingType === "온라인"
                            ? "#3cb4ac"
                            : post.meetingType === "오프라인"
                            ? "#888"
                            : "#f6b93b"
                        }`,
                        color:
                          post.meetingType === "온라인"
                            ? "#3cb4ac"
                            : post.meetingType === "오프라인"
                            ? "#888"
                            : "#f6b93b",
                        background: "#fff",
                        borderRadius: 8,
                        padding: "2px 14px",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                      }}
                    >
                      {post.meetingType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <Pagination />
      </section>
    </div>
  );
}
