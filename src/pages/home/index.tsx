import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main/Main.css";
import { postApi, Post } from "../../api/post.ts";
import Spinner from "../../component/common/Spinner.tsx";
import { authApi } from "../../api/auth.ts";
import { showInfo } from "../../utils/sweetAlert.ts";
import LoginModal from "../../component/common/LoginModal.jsx";

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

// 카테고리 영어-한글 매핑
const categoryMap = {
  PROJECT: "프로젝트",
  CONTEST: "공모전",
  HACKATHON: "해커톤",
  STUDY: "스터디",
};

// 진행 방식 영어-한글 매핑
const typeMap = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
  HYBRID: "혼합",
  MIX: "혼합",
};

export default function HomePage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedType, setSelectedType] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const lastPausedTimeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 16;
  const navigate = useNavigate();
  const [isRecruiting, setIsRecruiting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authApi.isAuthenticated());

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

  // API 연동 (목록)
  const fetchPosts = async () => {
    try {
      const data = await postApi.getPosts();
      // id 내림차순 정렬 (최신글이 위로)
      const sorted = [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
      setPosts(sorted);
      setLoading(false);
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 날짜 포맷 변환 (YYYY-MM-DD를 YYYY.MM.DD로)
  const formatDate = (dateString) => {
    if (!dateString) return "마감일 미정";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    return dateString;
  };

  // 필터링된 모집글 게시물 가져오기
  const getFilteredPosts = () => {
    let filteredPosts = [...posts];

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      filteredPosts = filteredPosts.filter((post) => {
        // API의 category 값을 한글로 변환하여 비교
        const koreanCategory = categoryMap[post.category] || post.category;
        return koreanCategory === selectedCategory;
      });
    }

    // 진행 방식 필터링
    if (selectedType) {
      filteredPosts = filteredPosts.filter((post) => {
        // API의 type 값을 한글로 변환하여 비교
        const koreanType = typeMap[post.type] || post.type;
        return koreanType === selectedType;
      });
    }

    // 모집중 체크 시 마감일이 오늘 이전인 글은 제외
    if (isRecruiting) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filteredPosts = filteredPosts.filter((post) => {
        if (!post.endedAt) return true;

        // 마감일 형식 변환
        const deadline = new Date(post.endedAt);
        deadline.setHours(0, 0, 0, 0);

        // 오늘 날짜 포함(마감일 당일까지 모집중)
        return deadline >= today;
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

  // 페이지네이션 컴포넌트 (더 깔끔하게 개선)
  const Pagination = () => {
    const totalPages = Math.ceil(getFilteredPosts().length / postPerPage);
    if (totalPages <= 1) return null;
    const pageNumbers: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const activeStyle = {
      backgroundColor: "#FFD54F",
      color: "#1b3a4b",
      borderColor: "#FFD54F",
    };

    const normalStyle = {
      color: "#1b3a4b",
    };

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          style={{ color: "#1b3a4b" }}
        >
          이전
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`pagination-number ${
                currentPage === 1 ? "active" : ""
              }`}
              style={currentPage === 1 ? activeStyle : normalStyle}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`pagination-number ${
              currentPage === number ? "active" : ""
            }`}
            style={currentPage === number ? activeStyle : normalStyle}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`pagination-number ${
                currentPage === totalPages ? "active" : ""
              }`}
              style={currentPage === totalPages ? activeStyle : normalStyle}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          style={{ color: "#1b3a4b" }}
        >
          다음
        </button>
      </div>
    );
  };

  const changeBanner = (index: number) => {
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

  // 카테고리/타입 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, isRecruiting]);

  const currentPosts = getCurrentPagePosts();

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  // 팀원 모집하기 버튼 클릭 핸들러
  const handleRecruitClick = () => {
    if (!isLoggedIn) {
      showInfo("팀원 모집하기는 로그인 후 이용 가능합니다.");
      setShowLoginModal(true);
      return;
    }
    navigate("/post/create");
  };

  // 모집 중인지 확인하는 함수 추가
  const isPostRecruiting = (post) => {
    if (!post?.endedAt) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(post.endedAt);
    deadline.setHours(0, 0, 0, 0);

    return deadline >= today;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Spinner size="large" text="로딩중입니다" />
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          flexDirection: "column",
          color: "#555",
        }}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}
        >
          {error || "게시글이 없습니다."}
        </div>
        <div style={{ fontSize: "14px" }}>
          {error
            ? "잠시 후 다시 시도해주세요."
            : "첫 번째 게시글을 작성해보세요!"}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <section className="banner-section">
        <div className="banner-left">
          <div className="banner-text">
            <h1>팀원 준비 완료!</h1>
            <h2>팀워크가 필요할 때, Teamo</h2>
            <button className="create-team-btn" onClick={handleRecruitClick}>
              팀원 모집하기
            </button>
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">진행 방식</option>
            <option value="온라인">온라인</option>
            <option value="오프라인">오프라인</option>
            <option value="혼합">혼합</option>
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
              key={post?.id || Math.random()}
              className="recruitment-card"
              onClick={() => handlePostClick(post?.id ?? 0)}
              style={{ cursor: "pointer" }}
            >
              <div className="recruitment-image">
                <img
                  src={
                    post?.image
                      ? post.image
                      : isRecruiting || isPostRecruiting(post)
                      ? "/open.png"
                      : "/closed.png"
                  }
                  alt={post?.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className="recruitment-category">
                  {categoryMap[post?.category] || post?.category || "기타"}
                </span>
              </div>
              <div className="recruitment-content">
                <h3>{post?.title || "제목 없음"}</h3>
                <div className="recruitment-meta">
                  <div className="tech-stack">
                    {(post?.skills || []).slice(0, 5).map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {(post?.skills?.length || 0) > 5 && (
                      <span className="tech-tag">
                        +{post.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
                <div className="recruitment-stats">
                  <div className="recruitment-status-container">
                    <div className="status">
                      <span className="status-text">모집 현황:</span>
                      {isPostRecruiting(post) ? (
                        <span>
                          {post?.currentCount ?? 0}/{post?.headCount ?? 0}
                        </span>
                      ) : (
                        <span className="status-closed">모집마감</span>
                      )}
                    </div>
                    <div className="deadline">
                      <span className="deadline-text">마감일:</span>
                      <span className="deadline-date">
                        {formatDate(post?.endedAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>
                    <span
                      style={{
                        display: "inline-block",
                        border: `1.5px solid ${
                          typeMap[post?.type] === "온라인"
                            ? "#FFD54F"
                            : typeMap[post?.type] === "오프라인"
                            ? "#888"
                            : "#FF9800"
                        }`,
                        color:
                          typeMap[post?.type] === "온라인"
                            ? "#FFD54F"
                            : typeMap[post?.type] === "오프라인"
                            ? "#888"
                            : "#FF9800",
                        background: "#fff",
                        borderRadius: 8,
                        padding: "2px 14px",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                      }}
                    >
                      {typeMap[post?.type] || post?.type || "미정"}
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

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            setIsLoggedIn(true);
            navigate("/post/create");
          }}
        />
      )}
    </div>
  );
}
