import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/profile/Profile.css";
import { userApi, User } from "../../api/user.ts";

interface UserData {
  id: number;
  name: string;
  profileImg: string;
  skills: string[];
  introduce: string;
  projects: {
    id: number;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
  }[];
  reviews: {
    id: number;
    author: string;
    content: string;
    date: string;
  }[];
  resumeList: {
    id: number;
    title: string;
    content: string;
    date: string;
  }[];
}

// 더미 데이터 - 로그인한 사용자 정보
const initialUserData = {
  id: 1,
  name: "리박스",
  profileImg: "https://via.placeholder.com/150",
  skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js"],
  introduce:
    "안녕하세요! 프론트엔드 개발자 리박스입니다. 팀 프로젝트에 관심이 많습니다.",
  projects: [
    {
      id: 1,
      title: "레츠잇 리액트 앱 개발",
      description:
        "React와 TypeScript를 활용한 팀 프로젝트 매칭 웹 애플리케이션 개발",
      date: "2023-04-25",
      thumbnail: "https://via.placeholder.com/100",
    },
  ],
  // 리뷰 데이터 추가
  reviews: [
    {
      id: 1,
      author: "김철수",
      content:
        "프로젝트 동안 코드 작성이 깔끔했고, 적극적으로 참여해주셔서 좋았습니다. 협업하기 정말 좋은 개발자입니다. 커뮤니케이션도 원활했고, 약속한 시간도 잘 지켜주셔서 프로젝트가 순조롭게 진행될 수 있었습니다.",
      date: "2023-04-20",
    },
    {
      id: 2,
      author: "박영희",
      content:
        "훌륭한 팀원이었습니다. 뛰어난 문제 해결 능력을 갖추고 있어 어려운 상황에서도 적절한 솔루션을 제시해 주었습니다. 다음에도 기회가 된다면 꼭 같이 일하고 싶습니다.",
      date: "2023-05-15",
    },
    {
      id: 3,
      author: "이민수",
      content:
        "리액트와 타입스크립트에 대한 지식이 매우 풍부했고, 다른 팀원들에게도 친절하게 가르쳐주셨습니다. 팀 분위기를 좋게 만들어주셨고, 덕분에 프로젝트가 즐겁게 마무리될 수 있었습니다.",
      date: "2023-06-10",
    },
  ],
  // 자기소개서 데이터 추가
  resumeList: [
    {
      id: 1,
      title: "웹 개발자 지원 자기소개서",
      content:
        "안녕하세요, 웹 개발자로 지원하는 리박스입니다. React와 TypeScript를 활용한 프로젝트 경험이 풍부하며, 협업을 중요시합니다.",
      date: "2023-04-25",
    },
    {
      id: 2,
      title: "프론트엔드 개발자 자기소개서",
      content:
        "안녕하세요. 3년차 웹 개발자 김지원입니다. 프론트엔드의 백엔드 모두 경험이 있으며, 특히 React와 Node.js를 활용한 프로젝트에 강점이 있습니다.",
      date: "2023-06-30",
    },
  ],
};

// 프로필 수정 모달 컴포넌트
const ProfileEditModal = ({ isOpen, onClose, userData, onUpdate }) => {
  const [name, setName] = useState(userData.name);
  const [intro, setIntro] = useState(userData.introduce);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 프로필 정보 업데이트
    onUpdate({
      ...userData,
      name,
      introduce: intro,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>프로필 수정</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="profile-image-upload">
              <div className="profile-image-preview">
                <img
                  src={userData.profileImg}
                  alt={`${userData.name} 프로필`}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <button type="button" className="edit-image-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="intro">소개</label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                className="form-control"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="save-btn">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // 참여/작성한 모집글 더미 (실제로는 API에서 가져옴)
  const myPosts = [
    { id: 1, title: "[서울] Kettodze - 일본 가챠 매장" },
    { id: 3, title: "AI 기반 추천 시스템 개발" },
    { id: 5, title: "쇼핑몰 마케팅 전략 기획 스터디" },
  ];
  // 리뷰 작성 상태
  const [reviewPostId, setReviewPostId] = useState(""); // 모집글 id
  const [reviewContent, setReviewContent] = useState("");
  // 리뷰 작성자 프로필 더미 (실제로는 리뷰 author id 등으로 받아야 함)
  const reviewerProfileImg = "https://via.placeholder.com/40x40.png?text=U";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const data = await userApi.getUser(Number(id));
          setUserData(data);
        } else {
          const data = await userApi.getCurrentUser();
          setUserData(data);
        }
        setLoading(false);
      } catch (err) {
        setError("사용자 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // 프로필 업데이트
  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
    alert("프로필이 수정되었습니다.");
  };

  // 자기소개서 삭제
  const handleDeleteResume = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // 자기소개서 삭제 처리
      const updatedResumeList = userData.resumeList.filter(
        (resume) => resume.id !== id
      );

      setUserData({
        ...userData,
        resumeList: updatedResumeList,
      });

      alert("자기소개서가 삭제되었습니다.");
    }
  };

  // 리뷰 작성 핸들러
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    setUserData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          id: Date.now(),
          postId: reviewPostId,
          postTitle:
            myPosts.find((p) => String(p.id) === reviewPostId)?.title || "",
          content: reviewContent,
          date: dateStr,
        },
      ],
    }));
    setReviewPostId("");
    setReviewContent("");
    alert("리뷰가 등록되었습니다.");
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div className="profile-container">
      {/* 상단 프로필 영역 */}
      <div className="profile-header">
        <div className="profile-info-container">
          <div className="profile-left">
            <div className="profile-image">
              <img
                src={userData.profileImg}
                alt={`${userData.name} 프로필`}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-top">
              <h2 className="profile-name">{userData.name}</h2>
            </div>
            <div className="profile-stats">
              <button
                className="edit-profile-btn"
                onClick={() => setIsProfileModalOpen(true)}
              >
                프로필 수정
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 형태의 컨텐츠 영역 */}
      <div className="profile-content">
        {/* 기본 정보 섹션 */}
        <div className="section">
          <h3 className="section-title">기본 정보</h3>
          <div className="info-section">
            <div className="info-card">
              <h3>소개</h3>
              <p>{userData.introduce}</p>
            </div>
          </div>
        </div>

        {/* 포스팅 섹션 */}
        <div className="section">
          <h3 className="section-title">포스팅</h3>
          <div className="posts-section">
            {userData.projects.length > 0 ? (
              <div className="posts-container">
                {userData.projects.map((project) => (
                  <div
                    className="post-card"
                    key={project.id}
                    onClick={() => navigate(`/post/${project.id}`)}
                  >
                    <div className="post-thumbnail">
                      <img src={project.thumbnail} alt={project.title} />
                    </div>
                    <div className="post-info">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <span className="post-date">{project.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">작성한 글이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 활동 섹션 */}
        <div className="section">
          <h3 className="section-title">활동</h3>
          <div className="activity-section">
            <div className="no-content">최근 활동 내역이 없습니다.</div>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="section">
          <h3 className="section-title">받은 리뷰</h3>
          <div className="reviews-section">
            {userData.reviews.length > 0 ? (
              <div className="reviews-container">
                {userData.reviews.map((review) => (
                  <div
                    className="review-card"
                    key={review.id}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "#fcfcfc",
                      borderRadius: 10,
                      padding: 20,
                      marginBottom: 18,
                      boxShadow: "0 1px 4px #0001",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* 프로필 이미지 */}
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={reviewerProfileImg}
                        alt="작성자 프로필"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "#eee",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 16 }}>
                          {review.author || "익명"}
                        </span>
                        {/* 별점 제거됨 */}
                        <span style={{ color: "#888", fontSize: 13 }}>
                          {review.date}
                        </span>
                      </div>
                      {/* 관련 프로젝트 */}
                      {review.postTitle && (
                        <div
                          style={{
                            color: "#3cb4ac",
                            fontSize: 13,
                            fontWeight: 500,
                            marginBottom: 4,
                          }}
                        >
                          {review.postTitle}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 15,
                          color: "#222",
                          lineHeight: 1.7,
                          paddingLeft: 0,
                          marginLeft: 0,
                        }}
                      >
                        {review.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">받은 리뷰가 없습니다.</div>
            )}
          </div>
          {/* 리뷰 작성 폼 */}
          <form
            onSubmit={handleReviewSubmit}
            className="review-form"
            style={{
              marginTop: 24,
              background: "#f9f9f9",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <select
                value={reviewPostId}
                onChange={(e) => setReviewPostId(e.target.value)}
                style={{
                  width: 180,
                  minWidth: 120,
                  maxWidth: 220,
                  padding: 7,
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  fontSize: 15,
                }}
              >
                <option value="">관련 프로젝트(선택)</option>
                {myPosts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="리뷰 내용을 입력해주세요. (필수)"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              style={{
                width: "100%",
                minHeight: 60,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ddd",
                marginBottom: 10,
              }}
              required
            />
            <div style={{ textAlign: "right" }}>
              <button type="submit" className="add-btn">
                리뷰 등록
              </button>
            </div>
          </form>
        </div>

        {/* 자기소개서 섹션 */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">자기소개서</h3>
            <button
              className="add-btn"
              onClick={() => navigate("/profile/resume/new")}
            >
              + 작성하기
            </button>
          </div>
          <div className="resume-section">
            {userData.resumeList.length > 0 ? (
              <div className="resume-container">
                {userData.resumeList.map((resume) => (
                  <div
                    className="resume-card"
                    key={resume.id}
                    onClick={() => navigate(`/profile/resume/${resume.id}`)}
                  >
                    <div className="resume-header">
                      <h4>{resume.title}</h4>
                      <span className="resume-date">{resume.date}</span>
                    </div>
                    <p className="resume-content">
                      {resume.content.length > 150
                        ? `${resume.content.substring(0, 150)}...`
                        : resume.content}
                    </p>
                    <div className="word-count">
                      {resume.content.length}/3000
                    </div>
                    <div
                      className="resume-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/profile/resume/edit/${resume.id}`)
                        }
                      >
                        수정
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteResume(resume.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">작성한 자기소개서가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default ProfilePage;
