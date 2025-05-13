import React, { useState, useEffect, ReactNode, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/hub/Hub.css";
import { resumeApi } from "../../api/resume.ts";
import Spinner from "../../component/common/Spinner.tsx";

// 대표 이력서 타입 정의
interface MainResume {
  id: number;
  title: string;
  content: string;
  date: string;
  skills: string[];
  personality: string;
  isMain: boolean;
  userId: number;
  userName?: string;
  userProfileImage?: string;
  portfolio?: string;
  profile?: {
    id: number;
    name: string;
    introduction: string;
    image: string;
    nickname: string;
    userId: number;
  };
}

const HubPage = () => {
  const [mainResumes, setMainResumes] = useState<MainResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const resumesPerPage = 16;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const initialTopPosition = 100; // 처음 위치 (px)

  // 대표 이력서 목록 조회를 위한 함수
  const fetchMainResumes = async () => {
    try {
      setResumeLoading(true);
      // api/resumes/main 엔드포인트 사용
      const mainResumeList = await resumeApi.getMainResumes();
      setMainResumes(mainResumeList);

      // 모든 기술 스택 목록 계산 (중복 제거)
      const skills = Array.from(
        new Set(mainResumeList.flatMap((resume) => resume.skills))
      ).sort();
      setAllSkills(skills);

      setResumeLoading(false);
      setLoading(false);
    } catch (err) {
      console.error("대표 자기소개서 목록을 불러오는데 실패했습니다:", err);
      setResumeError("대표 자기소개서 목록을 불러오는데 실패했습니다.");
      setResumeLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainResumes();
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        // 스크롤 위치에 관계없이 같은 위치에 유지
        sidebarRef.current.style.top = `${initialTopPosition}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filteredResumes = [...mainResumes];

    // 스킬 필터링
    if (selectedSkills.length > 0) {
      filteredResumes = filteredResumes.filter((resume) =>
        selectedSkills.every((skill) => resume.skills.includes(skill))
      );
    }

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredResumes = filteredResumes.filter(
        (resume) =>
          resume.title.toLowerCase().includes(term) ||
          resume.content.toLowerCase().includes(term) ||
          (resume.userName && resume.userName.toLowerCase().includes(term)) ||
          resume.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    setMainResumes(filteredResumes);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [selectedSkills, searchTerm]);

  // 스킬 선택 토글
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // 현재 페이지에 표시할 이력서 계산
  const indexOfLastResume = currentPage * resumesPerPage;
  const indexOfFirstResume = indexOfLastResume - resumesPerPage;
  const currentResumes = mainResumes.slice(
    indexOfFirstResume,
    indexOfLastResume
  );

  // 페이지 수 계산
  const totalPages = Math.ceil(mainResumes.length / resumesPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    const buttons: ReactNode[] = [];

    // 이전 페이지 버튼
    buttons.push(
      <button
        key="prev"
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
        disabled={currentPage === 1}
      >
        이전
      </button>
    );

    // 페이지 번호 버튼
    // 5개 이상의 페이지가 있을 경우 현재 페이지 주변 페이지만 표시
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4 && totalPages > 4) {
      startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className="pagination-number"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-number ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className="pagination-number"
        >
          {totalPages}
        </button>
      );
    }

    // 다음 페이지 버튼
    buttons.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        className={`pagination-btn ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    );

    return buttons;
  };

  // 스크롤이 필요한 경우에만 스크롤바 표시
  useEffect(() => {
    // 모든 skills 컨테이너 가져오기
    const skillsContainers = document.querySelectorAll(".skills");

    // 각 컨테이너 확인
    skillsContainers.forEach((container) => {
      // 스크롤이 필요한지 확인 (콘텐츠가 컨테이너보다 큰 경우)
      if (container.scrollHeight > container.clientHeight) {
        container.classList.add("scrollable");
      } else {
        container.classList.remove("scrollable");
      }
    });
  }, [mainResumes, currentPage]);

  return (
    <div className="hub-container">
      <div className="hub-title">
        <h1>자기소개서 허브</h1>
        <p>개발자들의 대표 자기소개서를 확인해보세요</p>
      </div>

      <div className="hub-content-wrapper">
        <div className="hub-main-content">
          {resumeLoading ? (
            <div className="loading-container">
              <Spinner size="medium" color="#FFD43B" />
              <p>대표 자기소개서 목록을 불러오는 중입니다...</p>
            </div>
          ) : resumeError ? (
            <div className="error-message">
              <p>{resumeError}</p>
            </div>
          ) : currentResumes.length > 0 ? (
            <div className="resume-list">
              {currentResumes.map((resume) => (
                <Link
                  to={`/profile/resume/${resume.id}`}
                  key={resume.id}
                  className="resume-card"
                >
                  <div className="resume-card-content">
                    <div className="resume-profile">
                      <img
                        src={
                          resume.profile?.image ||
                          resume.userProfileImage ||
                          "/profile.png"
                        }
                        alt="프로필"
                        className="resume-profile-image"
                        onError={(e) => {
                          e.currentTarget.src = "/profile.png";
                        }}
                      />
                    </div>
                    <div className="resume-info">
                      <p className="resume-position">{resume.title}</p>
                      <p className="resume-company">
                        {resume.profile?.nickname ||
                          resume.userName ||
                          "개발자"}
                      </p>
                      <p className="resume-description">
                        {resume.content.length > 80
                          ? `${resume.content.substring(0, 80)}...`
                          : resume.content}
                      </p>
                    </div>
                    <div className="resume-tag-list">
                      {resume.skills &&
                        resume.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="resume-skill-tag">
                            {skill}
                          </span>
                        ))}
                      {resume.skills && resume.skills.length > 4 && (
                        <span className="resume-skill-tag more-tag">
                          +{resume.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>등록된 대표 이력서가 없습니다.</p>
            </div>
          )}

          {/* 16개 이하여도 항상 페이지네이션 표시 */}
          {mainResumes.length > 0 && (
            <div className="pagination">{renderPaginationButtons()}</div>
          )}
        </div>

        <div className="hub-sidebar" ref={sidebarRef}>
          <div className="sidebar-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="이력서·스킬 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">
                <span>🔍</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>기술 스택</h3>
            <div className="tech-list">
              {allSkills.map((skill, index) => (
                <button
                  key={index}
                  className={`tech-button ${
                    selectedSkills.includes(skill) ? "active" : ""
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubPage;
