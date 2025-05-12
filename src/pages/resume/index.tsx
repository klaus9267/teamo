import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../../styles/resume/index.css";

const ResumeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const searchInputRef = useRef(null);

  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [personality, setPersonality] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  // 스킬 목록 (실제로는 API에서 가져와야 함)
  const availableSkills = [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "HTML/CSS",
    "Python",
    "Java",
    "Spring",
    "AWS",
    "Docker",
    "Git",
    "SQL",
  ];

  // 검색어에 따른 필터링된 스킬 목록
  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  // 편집 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isEditing) {
      // 실제로는 API 호출하여 데이터 불러오기
      // 예시 데이터
      setTimeout(() => {
        const resumeData = {
          id: 1,
          title: "프론트엔드 개발자 자기소개서",
          content:
            "안녕하세요. 저는 프론트엔드 개발자를 지망하는 김민준입니다.\n\n저는 3년간의 웹 개발 경험을 가지고 있으며, 사용자 중심의 인터페이스 개발에 열정을 가지고 있습니다. JavaScript, React, TypeScript를 주로 사용하며, 특히 Next.js와 같은 프레임워크에도 관심을 가지고 학습하고 있습니다.\n\n주요 프로젝트 경험으로는...",
          skills: ["JavaScript", "React", "TypeScript", "Node.js"],
          personality:
            "프론트엔드 개발자 | UX/UI 디자인 역량 | 새로운 기술에 열려있는 창의적인 문제 해결사",
          date: "2023-04-20",
        };

        setTitle(resumeData.title);
        setContent(resumeData.content);
        setSelectedSkills(resumeData.skills);
        setPersonality(resumeData.personality);
        setLoading(false);
      }, 500);
    }
  }, [isEditing, id]);

  // 스킬 검색창 포커스 시 제안 표시
  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  // 스킬 선택 처리
  const handleSelectSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSearchTerm("");
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  // 스킬 제거 처리
  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // 데이터 구성
    const resumeData = {
      title,
      content,
      skills: selectedSkills,
      personality,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      // 저장 완료 후 프로필 페이지로 이동
      alert(
        isEditing
          ? "자기소개서가 수정되었습니다."
          : "자기소개서가 저장되었습니다."
      );
      navigate("/profile");
    } catch (error) {
      alert("자기소개서 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 문서 클릭 시 제안 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="resume-form-container">
      <div className="form-header">
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
          자기소개서 목록으로 돌아가기
        </Link>
        <h1>{isEditing ? "자기소개서 수정" : "새 자기소개서 작성"}</h1>
        <p>자신을 효과적으로 표현할 수 있는 자기소개서를 작성해보세요.</p>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <form onSubmit={handleSubmit} className="resume-form">
          <div className="form-group">
            <label htmlFor="title">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="자기소개서 제목을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>기술 스택</label>
            <div className="skills-search-container" ref={searchInputRef}>
              <div className="selected-skills">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="skill-tag selected">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="form-control skill-search"
                  placeholder="기술 스택 검색 (예: JavaScript, Python, React)"
                />
                <div className="search-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {showSuggestions && filteredSkills.length > 0 && (
                <div className="skills-suggestions">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-suggestion-item"
                      onClick={() => handleSelectSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="personality">성향 및 성격</label>
            <input
              type="text"
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="form-control"
              placeholder="자신의 성향, 업무 스타일, 팀에 맞는 점을 간략하게 작성하세요."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">
              자기소개서 내용 <span className="required">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control content-editor"
              placeholder="자신의 경험, 역량 스토리, 팀에 맞는 점을 자세하게 작성하세요."
              rows={10}
              required
            />
            <div className="word-count">{content.length}/3000</div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              취소
            </button>
            <button type="submit" className="save-btn">
              {isEditing ? "수정완료" : "등록"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResumeForm;
