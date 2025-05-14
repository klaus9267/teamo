import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../../styles/resume/index.css";
import { resumeApi } from "../../api/resume.ts";
import { showSuccess, showError, showWarning } from "../../utils/sweetAlert.ts";
import Spinner from "../../component/common/Spinner.tsx";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [currentPortfolio, setCurrentPortfolio] = useState(null);

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

  // 스킬 아이콘 매핑
  const skillIcons = {
    JavaScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    React:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    TypeScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "Node.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "HTML/CSS":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    Python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    Spring:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    Docker:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  };

  // 기본 아이콘
  const defaultIcon = "/icons/question-mark.svg";

  // 검색어에 따른 필터링된 스킬 목록
  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  // 편집 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    const fetchResumeData = async () => {
      if (isEditing && id) {
        try {
          // API 호출하여 데이터 불러오기
          const data = await resumeApi.getResume(Number(id));
          console.log("불러온 자기소개서 데이터:", data);

          setTitle(data.title || "");
          setContent(data.content || "");
          setSelectedSkills(Array.from(new Set(data.skills || [])));
          setPersonality(data.personality || "");
          setIsMain(data.isMain || false);

          // 포트폴리오 파일이 있을 경우
          if (data.portfolio) {
            setCurrentPortfolio(data.portfolio);
            // 파일 이름 추출
            const fileNameFromUrl = data.portfolio.split("/").pop();
            setFileName(fileNameFromUrl || "첨부된 포트폴리오");
          }

          setLoading(false);
        } catch (error) {
          console.error("자기소개서 데이터 로딩 오류:", error);
          showError("자기소개서 데이터를 불러오는데 실패했습니다.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchResumeData();
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

  // 파일 업로드 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setCurrentPortfolio(null); // 새 파일 선택 시 기존 포트폴리오 파일 정보 초기화
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim() || !content.trim()) {
      showWarning("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("폼 제출 시작");

      // FormData 생성
      const formData = new FormData();

      // DTO 형식에 맞게 JSON 데이터 구성
      const requestData = {
        title: title,
        content: content,
        personality: personality,
        skills: selectedSkills, // 스킬 목록을 request 객체에 포함
        isMain: isMain,
      };

      console.log("자기소개서 제출 데이터:", requestData);

      // request 필드에 JSON 형태로 추가
      formData.append("request", JSON.stringify(requestData));

      // 스킬은 별도로 추가 (서버 요청 형식에 맞춤)
      selectedSkills.forEach((skill) => {
        formData.append("skills", skill);
      });

      console.log("선택된 스킬 목록:", selectedSkills);

      // 파일이 있으면 추가
      if (file) {
        formData.append("file", file);
      }

      if (id) {
        // 기존 이력서 수정
        console.log("자기소개서 수정 요청 전송 (ID: " + id + ")");
        const result = await resumeApi.updateResume(Number(id), formData);
        console.log("자기소개서 수정 결과:", result);
        setIsSubmitting(false);
        showSuccess("자기소개서가 수정되었습니다.");
        navigate("/profile");
      } else {
        // 새 이력서 생성
        console.log("새 자기소개서 생성 요청 전송");
        const result = await resumeApi.createResume(formData);
        console.log("자기소개서 생성 결과:", result);
        setIsSubmitting(false);
        showSuccess("자기소개서가 저장되었습니다.");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setIsSubmitting(false);

      // 401 Unauthorized 에러는 config.ts의 인터셉터에서 처리됨
      // 그 외의 에러는 여기서 처리
      if (error.response && error.response.status !== 401) {
        showError("자기소개서 저장에 실패했습니다. 다시 시도해주세요.");
      } else if (!error.response) {
        // 응답이 없는 경우 (네트워크 에러 등)
        showError("서버 연결에 실패했습니다. 인터넷 연결을 확인해주세요.");
      }
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
        <div className="loading-container">
          <Spinner size="large" text="자기소개서 로딩 중..." />
        </div>
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
                {selectedSkills.map((skill, idx) => (
                  <span key={`${skill}-${idx}`} className="skill-tag selected">
                    <img
                      src={skillIcons[skill] || defaultIcon}
                      alt={skill}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "5px",
                      }}
                    />
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
                      <img
                        src={skillIcons[skill] || defaultIcon}
                        alt={skill}
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      />
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

          <div className="file-upload-container">
            <label className="file-upload-label">포트폴리오 파일 첨부</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {fileName ? (
                <div className="file-name">
                  {currentPortfolio ? (
                    <>
                      <span>현재 파일: {fileName}</span>
                      {currentPortfolio && (
                        <a
                          href={currentPortfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="current-file-link"
                        >
                          보기
                        </a>
                      )}
                    </>
                  ) : (
                    `새 파일: ${fileName}`
                  )}
                </div>
              ) : (
                <div className="file-placeholder">
                  클릭하여 포트폴리오 파일을 업로드하세요 (PDF, DOC, DOCX)
                </div>
              )}
            </div>
          </div>

          <div className="main-resume-option">
            <input
              type="checkbox"
              id="isMain"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
            />
            <label htmlFor="isMain">
              이 자기소개서를 대표 자기소개서로 설정
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              취소
            </button>
            <button type="submit" className="save-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="loading-text">처리 중...</span>
              ) : isEditing ? (
                "수정완료"
              ) : (
                "등록"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResumeForm;
