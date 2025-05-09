import React, { useState, useEffect, ReactNode, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/hub/Hub.css";
import { developerApi, Developer } from "../../api/developer.ts";

const HubPage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const developersPerPage = 16;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const initialTopPosition = 100; // 처음 위치 (px)

  // API 연동을 위한 함수
  const fetchDevelopers = async () => {
    try {
      const data = await developerApi.getDevelopers();
      setDevelopers(data);
      // 모든 기술 스택 목록 계산 (중복 제거)
      const skills = Array.from(
        new Set(data.flatMap((dev) => dev.skills))
      ).sort();
      setAllSkills(skills);
      setLoading(false);
    } catch (err) {
      setError("개발자 목록을 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
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
    let filteredDevs = developers;

    // 스킬 필터링
    if (selectedSkills.length > 0) {
      filteredDevs = filteredDevs.filter((dev) =>
        selectedSkills.every((skill) => dev.skills.includes(skill))
      );
    }

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDevs = filteredDevs.filter(
        (dev) =>
          dev.name.toLowerCase().includes(term) ||
          dev.role.toLowerCase().includes(term) ||
          dev.company.toLowerCase().includes(term) ||
          dev.description.toLowerCase().includes(term) ||
          dev.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    setDevelopers(filteredDevs);
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

  // 현재 페이지에 표시할 개발자 계산
  const indexOfLastDeveloper = currentPage * developersPerPage;
  const indexOfFirstDeveloper = indexOfLastDeveloper - developersPerPage;
  const currentDevelopers = developers.slice(
    indexOfFirstDeveloper,
    indexOfLastDeveloper
  );

  // 페이지 수 계산
  const totalPages = Math.ceil(developers.length / developersPerPage);

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
  }, [developers, currentPage]);

  return (
    <div className="hub-container">
      <div className="hub-title">
        <h1>개발자 허브</h1>
        <p>기술 스택별로 개발자를 찾아보세요</p>
      </div>

      <div className="hub-content-wrapper">
        <div className="hub-main-content">
          <div className="developer-list">
            {currentDevelopers.length > 0 ? (
              currentDevelopers.map((dev) => (
                <Link
                  to={`/profile/${dev.id}`}
                  key={dev.id}
                  className="developer-card"
                >
                  <div className="developer-info">
                    <div className="profile-image">
                      <img src={dev.profileImg} alt={`${dev.name} 프로필`} />
                    </div>
                    <div className="developer-details">
                      <div className="name-badge">
                        <h3>{dev.name}</h3>
                      </div>
                      <p className="description">{dev.description}</p>
                      <div
                        className="skills"
                        ref={(el) => {
                          if (el) {
                            // 스크롤이 필요한지 실시간으로 확인
                            if (el.scrollHeight > el.clientHeight) {
                              el.classList.add("scrollable");
                            } else {
                              el.classList.remove("scrollable");
                            }
                          }
                        }}
                      >
                        {dev.skills.map((skill, index) => (
                          <span className="skill-tag" key={index}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-results">
                <p>해당 조건에 맞는 개발자가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {developers.length > developersPerPage && (
            <div className="pagination">{renderPaginationButtons()}</div>
          )}
        </div>

        <div className="hub-sidebar" ref={sidebarRef}>
          <div className="sidebar-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="직무·스킬 검색"
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
