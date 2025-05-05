import React, { useState, useEffect, ReactNode, useRef } from "react";
import "../../styles/hub/Hub.css";

// 개발자 데이터 인터페이스 정의
interface Developer {
  id: number;
  name: string;
  profileImg: string;
  role: string;
  company: string;
  experience: string;
  skills: string[];
  description: string;
  contactUrl: string;
}

// 더미 데이터
const developersData: Developer[] = [
  {
    id: 1,
    name: "이기준",
    profileImg: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "프론트엔드 개발자",
    company: "넷신저",
    experience: "2년차",
    skills: [
      "React",
      "TypeScript",
      "Styled-Components",
      "NodeJS",
      "MongoDB",
      "Figma",
    ],
    description:
      "안녕하세요! 프론트엔드 연차나 실력은 적습니다. 늘 잘 정돈된 문서와 정보를 공유하는 것을 좋아합니다. 🔥 내 명의 돈도 편하게 쓸 수 있는 코드가 좋은 코드라고 생각합니다. 👍 최적 프로덕트...",
    contactUrl: "mailto:example@example.com",
  },
  {
    id: 2,
    name: "김창업",
    profileImg: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "백엔드 개발자",
    company: "CLASS 101",
    experience: "4년차",
    skills: ["Java", "Spring", "MySQL", "AWS"],
    description:
      "백엔드 두려움이 없고 성장을 갈망하는 소프트웨어 엔지니어입니다. SI/SM 그리고 서비스 기업의 엔지니어로 활동했습니다.",
    contactUrl: "mailto:example2@example.com",
  },
  {
    id: 3,
    name: "박데이터",
    profileImg: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "프론트엔드 개발자",
    company: "NAVER",
    experience: "2년차",
    skills: ["React", "JavaScript", "HTML/CSS", "Python"],
    description:
      "좋은 길의 반대는 처음 길, 다양한 분야에서 시시팅헙회하며 독립적 연장이 커버 퓨펑 개발자입니다. 구글에서 '저스트 실 수'면 검색해보세요!",
    contactUrl: "mailto:example3@example.com",
  },
  {
    id: 4,
    name: "홍스택",
    profileImg: "https://randomuser.me/api/portraits/men/41.jpg",
    role: "풀스택 개발자",
    company: "국민은행(주)",
    experience: "5년차",
    skills: ["React", "Java", "Spring", "AWS", "MySQL"],
    description:
      "6년차 풀스택 개발자입니다. 코디가 아닌 개발자로 성장하기 위해 노력하고 있습니다. 소통과 협업의 중요성을 알고 있습니다! 늘 열린 문제를 제곱하고 다양한 상황에...",
    contactUrl: "mailto:example4@example.com",
  },
  {
    id: 5,
    name: "이분석",
    profileImg: "https://randomuser.me/api/portraits/men/36.jpg",
    role: "백엔드 개발자",
    company: "우아한형제들주식회사",
    experience: "3년차",
    skills: ["Java", "Spring", "AWS", "React", "MongoDB"],
    description:
      "처근 Seed 단계에 스타트업에 합류하여 Pre-A, TIPS 선정, 매출 증가의 성과를 함께한 백엔드 개발자 선정됩니다. 새로운 경력을 시작했다는 마음으로 매...",
    contactUrl: "mailto:example5@example.com",
  },
  {
    id: 6,
    name: "강개발",
    profileImg: "https://randomuser.me/api/portraits/men/67.jpg",
    role: "백엔드 개발자",
    company: "펜디",
    experience: "4년차",
    skills: ["Java", "JavaScript", "Spring", "React"],
    description:
      "21년 6월 처음 코퍼위한에서 개발을 시작하여 현시 경사심으로 오신 대표님의 과직으로 현재 회사에 임사하였습니다. 새로운 경력을 시작한다는 마음으로 매...",
    contactUrl: "mailto:example6@example.com",
  },
  {
    id: 7,
    name: "조디자인",
    profileImg: "https://randomuser.me/api/portraits/women/63.jpg",
    role: "프론트엔드 개발자",
    company: "카카오",
    experience: "3년차",
    skills: ["React", "JavaScript", "HTML/CSS", "Figma"],
    description:
      "사용자 경험을 중심으로 디자인과 개발을 함께 아우르는 프론트엔드 개발자입니다. UI/UX에 특별한 관심을 갖고 프로젝트를 진행합니다.",
    contactUrl: "mailto:example7@example.com",
  },
  {
    id: 8,
    name: "장모바일",
    profileImg: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "모바일 개발자",
    company: "배달의민족",
    experience: "4년차",
    skills: ["React Native", "Flutter", "Android", "iOS"],
    description:
      "크로스 플랫폼 모바일 애플리케이션 개발 전문가입니다. React Native와 Flutter를 활용한 다양한 프로젝트 경험이 있습니다.",
    contactUrl: "mailto:example8@example.com",
  },
  {
    id: 9,
    name: "김서버",
    profileImg: "https://randomuser.me/api/portraits/men/56.jpg",
    role: "백엔드 개발자",
    company: "토스",
    experience: "6년차",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    description:
      "대용량 트래픽 처리와 서버 아키텍처 설계에 전문성을 가진 백엔드 개발자입니다. 확장 가능하고 안정적인 시스템 구축을 추구합니다.",
    contactUrl: "mailto:example9@example.com",
  },
  {
    id: 10,
    name: "정알고리즘",
    profileImg: "https://randomuser.me/api/portraits/men/62.jpg",
    role: "백엔드 개발자",
    company: "네이버",
    experience: "5년차",
    skills: ["Python", "Django", "MySQL", "Redis"],
    description:
      "알고리즘 최적화와 효율적인 데이터 처리에 전문성을 가진 개발자입니다. 복잡한 문제를 해결하는 것을 좋아합니다.",
    contactUrl: "mailto:example10@example.com",
  },
  {
    id: 11,
    name: "한기획",
    profileImg: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "프로덕트 매니저",
    company: "쿠팡",
    experience: "7년차",
    skills: ["Product Management", "JIRA", "Figma", "Agile"],
    description:
      "사용자 중심 제품 기획과 개발 프로세스 관리 전문가입니다. 개발팀과의 원활한 소통을 통해 제품 가치를 극대화합니다.",
    contactUrl: "mailto:example11@example.com",
  },
  {
    id: 12,
    name: "배시큐어",
    profileImg: "https://randomuser.me/api/portraits/men/28.jpg",
    role: "보안 엔지니어",
    company: "삼성전자",
    experience: "8년차",
    skills: ["Network Security", "Penetration Testing", "Python", "Linux"],
    description:
      "애플리케이션 및 서버 보안 취약점 분석 전문가입니다. 안전한 시스템 구축을 위한 다양한 경험을 보유하고 있습니다.",
    contactUrl: "mailto:example12@example.com",
  },
  {
    id: 13,
    name: "고클라우드",
    profileImg: "https://randomuser.me/api/portraits/men/47.jpg",
    role: "데브옵스 엔지니어",
    company: "라인",
    experience: "6년차",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins"],
    description:
      "클라우드 인프라 관리 및 CI/CD 파이프라인 구축 전문가입니다. 자동화된 배포 시스템을 통해 개발 효율성을 높입니다.",
    contactUrl: "mailto:example13@example.com",
  },
  {
    id: 14,
    name: "윤데이터",
    profileImg: "https://randomuser.me/api/portraits/women/55.jpg",
    role: "데이터 사이언티스트",
    company: "현대카드",
    experience: "4년차",
    skills: ["Python", "TensorFlow", "Pandas", "SQL"],
    description:
      "데이터 분석 및 머신러닝 모델 개발 전문가입니다. 복잡한 데이터에서 가치 있는 인사이트를 도출하는 작업을 좋아합니다.",
    contactUrl: "mailto:example14@example.com",
  },
  {
    id: 15,
    name: "박프론트",
    profileImg: "https://randomuser.me/api/portraits/men/52.jpg",
    role: "프론트엔드 개발자",
    company: "당근마켓",
    experience: "3년차",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "사용자 친화적인 인터페이스와 효율적인 상태 관리를 구현하는 프론트엔드 개발자입니다. 최신 웹 기술에 항상 관심을 갖고 있습니다.",
    contactUrl: "mailto:example15@example.com",
  },
  {
    id: 16,
    name: "최블록체인",
    profileImg: "https://randomuser.me/api/portraits/men/39.jpg",
    role: "블록체인 개발자",
    company: "업비트",
    experience: "5년차",
    skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts"],
    description:
      "블록체인 기술과 스마트 컨트랙트 개발 전문가입니다. 탈중앙화 애플리케이션 구축 경험이 풍부합니다.",
    contactUrl: "mailto:example16@example.com",
  },
  {
    id: 17,
    name: "이게임",
    profileImg: "https://randomuser.me/api/portraits/men/17.jpg",
    role: "게임 개발자",
    company: "넥슨",
    experience: "7년차",
    skills: ["Unity", "C#", "3D Modeling", "Game Design"],
    description:
      "창의적인 게임 로직 구현과 최적화된 게임 성능을 추구하는 개발자입니다. 사용자 경험을 중시합니다.",
    contactUrl: "mailto:example17@example.com",
  },
  {
    id: 18,
    name: "강풀스택",
    profileImg: "https://randomuser.me/api/portraits/men/77.jpg",
    role: "풀스택 개발자",
    company: "우아한형제들",
    experience: "9년차",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    description:
      "프론트엔드부터 백엔드, 서버 관리까지 전반적인 개발 경험을 갖춘 풀스택 개발자입니다. 효율적인 아키텍처를 설계합니다.",
    contactUrl: "mailto:example18@example.com",
  },
  {
    id: 19,
    name: "김인공지능",
    profileImg: "https://randomuser.me/api/portraits/women/71.jpg",
    role: "AI 엔지니어",
    company: "SK텔레콤",
    experience: "4년차",
    skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
    description:
      "인공지능 모델 개발 및 최적화 전문가입니다. 컴퓨터 비전과 자연어 처리 분야에서 다양한 프로젝트를 수행했습니다.",
    contactUrl: "mailto:example19@example.com",
  },
  {
    id: 20,
    name: "이웹",
    profileImg: "https://randomuser.me/api/portraits/men/82.jpg",
    role: "웹 개발자",
    company: "NHN",
    experience: "6년차",
    skills: ["HTML", "CSS", "JavaScript", "PHP", "Laravel"],
    description:
      "웹 표준과 접근성을 중시하는 개발자입니다. 사용자 중심의 웹 서비스 구축에 전문성을 가지고 있습니다.",
    contactUrl: "mailto:example20@example.com",
  },
];

// 모든 기술 스택 목록 (중복 제거)
const allSkills = Array.from(
  new Set(developersData.flatMap((dev) => dev.skills))
).sort();

const HubPage = () => {
  const [developers, setDevelopers] = useState<Developer[]>(developersData);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const developersPerPage = 16;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const initialTopPosition = 100; // 처음 위치 (px)

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
    let filteredDevs = developersData;

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
                <div className="developer-card" key={dev.id}>
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
                </div>
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
