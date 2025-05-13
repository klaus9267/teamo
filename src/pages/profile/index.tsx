import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/profile/Profile.css";
import {
  userApi,
  ProfileResponse,
  Post,
  Review,
  Resume,
} from "../../api/user.ts";
import { resumeApi } from "../../api/resume.ts";
import { authApi, AUTH_TOKEN_KEY } from "../../api/auth.ts";
import Spinner from "../../component/common/Spinner.tsx";
import {
  showSuccess,
  showError,
  showWarning,
  showConfirm,
} from "../../utils/sweetAlert.ts";

interface ProfileData {
  id: number;
  username: string;
  profileImage: string;
  introduction: string;
  location: string;
  followers: number;
  following: number;
  myPosts: Post[];
  participatingPosts: Post[];
  reviews: Review[];
  resumes: Resume[];
}

// 더미 데이터 - 로그인한 사용자 정보
const initialUserData = {
  id: 1,
  nickname: "리박스",
  image: "https://via.placeholder.com/150",
  skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js"],
  introduction:
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
  resumes: [
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

// 프로필 수정 모달
const ProfileEditModal = ({ isOpen, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    nickname: userData.nickname,
    introduction: userData.introduction,
  });
  const [imagePreview, setImagePreview] = useState(userData.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef(null);
  const [imageChanged, setImageChanged] = useState(false);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 객체 직접 저장
      setImageFile(file);
      setImageChanged(true);

      // 미리보기용 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 변경 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.updateUser({
        nickname: formData.nickname,
        introduction: formData.introduction,
        image: imageChanged ? imageFile : null,
      });

      // 업데이트된 데이터로 UserData 형식에 맞게 변환
      const updatedUserData = {
        ...userData,
        nickname: formData.nickname,
        introduction: formData.introduction,
        image: imagePreview, // 미리보기 이미지를 사용하여 UI 즉시 업데이트
      };

      onUpdate(updatedUserData);
      onClose();
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      showError("프로필 업데이트에 실패했습니다.");
    }
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
                  src={imagePreview || "/profile.png"}
                  alt={`${userData.nickname} 프로필`}
                />
                <button
                  type="button"
                  className="edit-image-btn"
                  onClick={handleImageButtonClick}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="introduction">소개</label>
              <textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  setFormData({ ...formData, introduction: e.target.value })
                }
                className="form-control"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                취소
              </button>
              <button
                type="submit"
                className="save-btn"
                style={{
                  backgroundColor: "#FFD54F",
                  color: "#333333",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
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
  const [userData, setUserData] = useState<ProfileData | null>(null);
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
  const userInfo = authApi.getUserInfo();
  const myId = userInfo ? userInfo.id : null;
  // 내 프로필 확인 로직 수정 - 본인이 자신의 프로필 페이지에 접근하는 경우 항상 true로 설정
  const isMyProfile = id ? userData && myId && userData.id === myId : true;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let apiResponse: ProfileResponse;
        if (id) {
          apiResponse = await userApi.getUser(Number(id));
        } else {
          apiResponse = await userApi.getCurrentUser();
        }

        // 프로필 데이터가 있는지 확인
        if (!apiResponse || !apiResponse.profile) {
          setError("프로필 정보를 불러올 수 없습니다.");
          setLoading(false);
          return;
        }

        // API 응답 데이터를 UserData 형식에 맞게 변환
        const mappedData: ProfileData = {
          id: apiResponse.profile?.id || 0,
          username:
            apiResponse.profile?.nickname ||
            apiResponse.profile?.name ||
            "사용자",
          profileImage: apiResponse.profile?.image || "/profile.png",
          introduction: apiResponse.profile?.introduction || "",
          location: "", // API에서 제공하지 않는 경우 빈 문자열로 설정
          followers: 0, // API에서 제공하지 않는 경우 0으로 설정
          following: 0, // API에서 제공하지 않는 경우 0으로 설정
          myPosts: apiResponse.authorPosts || [],
          participatingPosts: apiResponse.joinedPosts || [],
          reviews: apiResponse.reviews || [],
          resumes: apiResponse.resumes || [],
        };

        setUserData(mappedData);

        // 내 프로필인 경우에만 사용자 ID를 localStorage에 저장
        if (!id && apiResponse.profile.userId) {
          localStorage.setItem("myUserId", String(apiResponse.profile.userId));
        }

        setLoading(false);
      } catch (err) {
        console.error("프로필 데이터 로딩 에러:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
        // 토큰 제거 및 메인 페이지로 리다이렉트
        if (!id) {
          // 내 프로필인 경우에만 토큰 제거 (다른 사용자 프로필 조회 실패는 제외)
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem("token");
          navigate("/"); // 메인 페이지로 리다이렉트
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  // 로그인하지 않은 경우 내 프로필 접근 시 로그인 페이지로 이동
  useEffect(() => {
    if (!userInfo && !id) {
      navigate("/login");
    }
  }, [userInfo, id, navigate]);

  // 프로필 업데이트
  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
    showSuccess("프로필이 수정되었습니다.");
  };

  // 자기소개서 삭제
  const handleDeleteResume = async (resumeId: number) => {
    const confirmed = await showConfirm(
      "자기소개서 삭제",
      "정말 삭제하시겠습니까?",
      "삭제",
      "취소"
    );

    if (confirmed) {
      // 자기소개서 삭제 API 호출 추가 필요
      try {
        await resumeApi.deleteResume(resumeId);

        const updatedResumes =
          userData?.resumes.filter((resume) => resume.id !== resumeId) || [];

        setUserData({
          ...userData!,
          resumes: updatedResumes,
        });

        showSuccess("자기소개서가 삭제되었습니다.");
      } catch (err) {
        console.error("자기소개서 삭제 에러:", err);
        showError("자기소개서 삭제에 실패했습니다.");
      }
    }
  };

  // 리뷰 작성 핸들러
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      showWarning("리뷰 내용을 입력해주세요.");
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
    showSuccess("리뷰가 등록되었습니다.");
  };

  // 대표 자기소개서 설정 핸들러
  const handleSetMainResume = async (resumeId: number) => {
    try {
      await resumeApi.setMainResume(resumeId);

      // 상태 업데이트
      const updatedResumes = userData?.resumes.map((resume) => ({
        ...resume,
        isMain: resume.id === resumeId,
      }));

      setUserData({
        ...userData!,
        resumes: updatedResumes,
      });

      showSuccess("대표 자기소개서가 설정되었습니다.");
    } catch (err) {
      console.error("대표 자기소개서 설정 에러:", err);
      showError("대표 자기소개서 설정에 실패했습니다.");
    }
  };

  // 모집 중인지 확인하는 함수 추가
  const isPostRecruiting = (post) => {
    if (!post.endedAt) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(post.endedAt);
    deadline.setHours(0, 0, 0, 0);

    return deadline >= today;
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <Spinner size="large" text="로딩중입니다" />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#FFD54F",
            color: "#1b3a4b",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          메인 페이지로 이동
        </button>
      </div>
    );
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>;

  // 배열 필드 안전 처리
  const authorPosts = userData.myPosts ?? [];
  const joinedPosts = userData.participatingPosts ?? [];
  const reviews = userData.reviews ?? [];
  const resumes = userData.resumes ?? [];

  return (
    <div className="profile-container">
      {/* 상단 프로필 영역 */}
      <div className="profile-header">
        <div className="profile-info-container">
          <div className="profile-left">
            <div className="profile-image">
              <img
                src={userData.profileImage || "/profile.png"}
                alt={`${userData.username} 프로필`}
              />
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-top">
              <h2 className="profile-name">{userData.username}</h2>
            </div>
            <div className="profile-stats">
              {isMyProfile && (
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  프로필 수정
                </button>
              )}
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
              <p>{userData.introduction}</p>
            </div>
          </div>
        </div>

        {/* 작성한 포스팅 섹션 */}
        <div className="section">
          <h3 className="section-title">작성한 포스팅</h3>
          <div className="posts-section">
            {authorPosts.length > 0 ? (
              <div className="posts-container">
                {authorPosts.map((post) => (
                  <div
                    className="post-card"
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <div className="post-thumbnail">
                      <img
                        src={
                          post.image
                            ? post.image
                            : isPostRecruiting(post)
                            ? "/open.png"
                            : "/closed.png"
                        }
                        alt={post.title}
                      />
                    </div>
                    <div className="post-info">
                      <h4>{post.title}</h4>
                      <p>{post.content.substring(0, 100)}...</p>
                      <div className="post-stats">
                        {isPostRecruiting(post) ? (
                          <span className="post-status">
                            모집 현황: {post.currentCount || 0}/
                            {post.headCount || 0}
                          </span>
                        ) : (
                          <span className="post-status-closed">모집마감</span>
                        )}
                        <span className="post-date">{post.endedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">작성한 글이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 참여 중인 포스팅 섹션 */}
        <div className="section">
          <h3 className="section-title">참여 중인 포스팅</h3>
          <div className="posts-section">
            {joinedPosts.length > 0 ? (
              <div className="posts-container">
                {joinedPosts.map((post) => (
                  <div
                    className="post-card"
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <div className="post-thumbnail">
                      <img
                        src={
                          post.image
                            ? post.image
                            : isPostRecruiting(post)
                            ? "/open.png"
                            : "/closed.png"
                        }
                        alt={post.title}
                      />
                    </div>
                    <div className="post-info">
                      <h4>{post.title}</h4>
                      <p>{post.content.substring(0, 100)}...</p>
                      <div className="post-stats">
                        {isPostRecruiting(post) ? (
                          <span className="post-status">
                            모집 현황: {post.currentCount || 0}/
                            {post.headCount || 0}
                          </span>
                        ) : (
                          <span className="post-status-closed">모집마감</span>
                        )}
                        <span className="post-date">{post.endedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">참여 중인 포스팅이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="section">
          <h3 className="section-title">받은 리뷰</h3>
          <div className="reviews-section">
            {reviews.length > 0 ? (
              <div className="reviews-container">
                {reviews.map((review) => (
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
                        src={
                          review.reviewer.image ||
                          "https://via.placeholder.com/40x40.png?text=U"
                        }
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
                          {review.reviewer.nickname || "익명"}
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
        </div>

        {/* 자기소개서 섹션 */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">자기소개서</h3>
            {isMyProfile && (
              <button
                className="add-btn"
                onClick={() => navigate("/profile/resume/new")}
                style={{
                  backgroundColor: "#FFD54F",
                  color: "#333333",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                + 작성하기
              </button>
            )}
          </div>
          <div className="resume-section">
            {resumes.length > 0 ? (
              <div className="resume-container">
                {resumes.map((resume) => (
                  <div
                    className="resume-card"
                    key={resume.id}
                    onClick={() => navigate(`/profile/resume/${resume.id}`)}
                  >
                    <div className="resume-header">
                      <h4>{resume.title}</h4>
                      {resume.isMain && (
                        <span className="resume-main-badge">대표</span>
                      )}
                    </div>
                    <p className="resume-content">
                      {resume.content.length > 150
                        ? `${resume.content.substring(0, 150)}...`
                        : resume.content}
                    </p>
                    <div className="word-count">
                      {resume.content.length}/3000
                    </div>
                    {isMyProfile && (
                      <div
                        className="resume-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!resume.isMain && (
                          <button
                            className="main-btn"
                            onClick={() => handleSetMainResume(resume.id)}
                          >
                            대표 설정
                          </button>
                        )}
                        <button
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/resume/edit/${resume.id}`);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
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
