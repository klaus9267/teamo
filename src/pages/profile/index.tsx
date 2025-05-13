import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { reviewApi } from "../../api/user.ts";
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

// 프로필 페이지에서 사용할 인터페이스 추가
interface TogetherPost {
  postId: number;
  postTitle: string;
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

// 리뷰 카드 컴포넌트를 분리하여 최적화
const ReviewCard = React.memo(({ review, userInfo, onEdit, onDelete }) => {
  // 로컬 스토리지에서 현재 사용자 ID 가져오기
  const myUserId = localStorage.getItem("myUserId");
  const currentUserId = myUserId ? Number(myUserId) : null;

  // 이 리뷰를 현재 사용자가 작성했는지 확인
  const isMyReview = currentUserId && review.reviewer?.userId === currentUserId;

  return (
    <div className="review-card" key={review.id}>
      {/* 프로필 이미지 */}
      <div className="reviewer-image">
        <img
          src={
            review.reviewer?.image ||
            "https://via.placeholder.com/40x40.png?text=U"
          }
          alt="작성자 프로필"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/40x40.png?text=U";
          }}
        />
      </div>
      <div className="review-content-wrapper">
        <div className="reviewer-info">
          <span className="reviewer-name">
            {review.reviewer?.nickname || "익명"}
          </span>
          {/* 현재 로그인한 사용자가 작성한 리뷰인 경우에만 수정/삭제 버튼 표시 */}
          {isMyReview && (
            <div className="review-actions">
              <button className="edit-btn" onClick={() => onEdit(review)}>
                수정
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(review.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {/* 관련 프로젝트 */}
        {review.postTitle && (
          <div className="review-project-title">{review.postTitle}</div>
        )}
        <div className="review-text">{review.content}</div>
      </div>
    </div>
  );
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [togetherPosts, setTogetherPosts] = useState<TogetherPost[]>([]);

  // 리뷰 작성 상태
  const [reviewPostId, setReviewPostId] = useState<number | "">("");
  const [reviewContent, setReviewContent] = useState("");
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    id: number;
    content: string;
    postId: number;
  } | null>(null);

  // 리뷰 작성자 프로필 (실제 데이터로 대체)
  const userInfo = authApi.getUserInfo();
  const myId = userInfo ? userInfo.id : null;

  // 내 프로필 확인 로직 수정
  // useEffect 내부가 아닌 컴포넌트 렌더링 시점에 계산하되, 필요한 값들이 있을 때만 계산
  const isMyProfile = useMemo(() => {
    if (!id) return true; // 내 프로필 페이지
    if (!userData || !myId) return false; // 데이터가 아직 없거나 로그인 안됨
    return userData.id === myId; // ID 비교
  }, [id, userData, myId]);

  // 사용자 데이터 요청 함수
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let apiResponse: ProfileResponse;
        if (id) {
          // 특정 사용자 프로필 조회
          apiResponse = await userApi.getUser(Number(id));
        } else {
          // 내 프로필 조회
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
          id: apiResponse.profile?.userId || 0,
          username:
            apiResponse.profile?.nickname ||
            apiResponse.profile?.name ||
            "사용자",
          profileImage: apiResponse.profile?.image || "/profile.png",
          introduction: apiResponse.profile?.introduction || "",
          location: "",
          followers: 0,
          following: 0,
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
    // 이 부분의 navigate 호출이 렌더링 사이클 중에 상태를 변경하고 무한 반복을 유발할 수 있음
    // 조건을 명확히 하고 상태를 체크하여 한 번만 호출되도록 수정
    if (!userInfo && !id && !loading) {
      navigate("/login");
    }
    // loading 상태를 의존성에 추가하고, 로딩 중에는 리다이렉트하지 않도록 함
  }, [userInfo, id, navigate, loading]);

  // 리뷰 작성 폼 토글 및 함께한 모집글 목록 로딩
  const toggleReviewForm = useCallback(async () => {
    // 리뷰 작성 폼을 열 때만 함께한 모집글 목록 로딩
    if (!isWritingReview && !isMyProfile && id) {
      try {
        // API 호출
        const response = await userApi.getTogetherPosts(Number(id));

        // 응답 결과를 정렬하여 알파벳순으로 보여줌
        const sortedPosts = [...response].sort((a, b) =>
          a.postTitle.localeCompare(b.postTitle)
        );

        setTogetherPosts(sortedPosts);
      } catch (err) {
        console.error("함께한 모집글 목록 조회 에러:", err);
        showError("함께한 모집글 목록을 불러오는데 실패했습니다.");
      }
    }

    // 리뷰 작성 폼 토글
    setIsWritingReview(!isWritingReview);
    setReviewContent("");
    setReviewPostId("");
    setEditingReview(null);
  }, [isWritingReview, isMyProfile, id]);

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
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      showWarning("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      if (editingReview) {
        // 리뷰 수정
        await reviewApi.updateReview(
          editingReview.id,
          typeof reviewPostId === "number" && reviewPostId > 0
            ? reviewPostId
            : null,
          reviewContent
        );

        // 현재 리뷰 목록 업데이트를 위한 API 호출
        if (id) {
          const updatedReviews = await reviewApi.getReviews(Number(id));

          setUserData({
            ...userData!,
            reviews: updatedReviews || [],
          });

          // 캐시 무효화
          sessionStorage.removeItem(`reviewsCache_${id}`);
        }

        showSuccess("리뷰가 수정되었습니다.");
      } else {
        // 리뷰 등록
        if (!id) {
          showError("사용자 ID를 찾을 수 없습니다.");
          return;
        }

        // postId가 비어있으면 null로 처리
        const postIdForApi =
          typeof reviewPostId === "number" && reviewPostId > 0
            ? reviewPostId
            : null;

        await reviewApi.createReview(Number(id), postIdForApi, reviewContent);

        // 리뷰 목록 업데이트를 위한 API 재호출
        const updatedReviews = await reviewApi.getReviews(Number(id));

        setUserData({
          ...userData!,
          reviews: updatedReviews || [],
        });

        // 캐시 무효화
        sessionStorage.removeItem(`reviewsCache_${id}`);

        showSuccess("리뷰가 등록되었습니다.");
      }

      // 폼 초기화
      setReviewContent("");
      setReviewPostId("");
      setIsWritingReview(false);
      setEditingReview(null);
    } catch (err) {
      console.error("리뷰 저장 에러:", err);
      showError("리뷰 저장에 실패했습니다.");
    }
  };

  // 리뷰 수정 핸들러 (useCallback으로 메모이제이션)
  const handleEditReview = useCallback((review) => {
    setEditingReview({
      id: review.id,
      content: review.content,
      postId: review.postId || 0,
    });
    setReviewContent(review.content);
    setReviewPostId(review.postId || 0);
    setIsWritingReview(true);
  }, []);

  // 리뷰 삭제 핸들러 (useCallback으로 메모이제이션)
  const handleDeleteReview = useCallback(
    async (reviewId: number) => {
      const confirmed = await showConfirm(
        "리뷰 삭제",
        "정말 삭제하시겠습니까?",
        "삭제",
        "취소"
      );

      if (confirmed) {
        try {
          await reviewApi.deleteReview(reviewId);

          if (id) {
            // 리뷰 목록 업데이트를 위한 API 재호출
            const updatedReviews = await reviewApi.getReviews(Number(id));

            setUserData((prevUserData) => ({
              ...prevUserData!,
              reviews: updatedReviews || [],
            }));

            // 캐시 무효화
            sessionStorage.removeItem(`reviewsCache_${id}`);
          }

          showSuccess("리뷰가 삭제되었습니다.");
        } catch (err) {
          console.error("리뷰 삭제 에러:", err);
          showError("리뷰 삭제에 실패했습니다.");
        }
      }
    },
    [id]
  );

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

  // 이미지 로드 오류 처리 핸들러
  const handleImageError = () => {
    setProfileImageError(true);
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
                src={
                  profileImageError
                    ? "/profile.png"
                    : userData.profileImage || "/profile.png"
                }
                alt={`${userData.username} 프로필`}
                onError={handleImageError}
              />
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-top">
              <h2 className="profile-name">
                {userData.username}
                {!isMyProfile && (
                  <span className="profile-username-suffix">님의 프로필</span>
                )}
              </h2>
              {isMyProfile && (
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  프로필 수정
                </button>
              )}
            </div>
            <div className="profile-introduction">
              {userData.introduction ? (
                <p>{userData.introduction}</p>
              ) : (
                <p className="no-introduction">소개글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 형태의 컨텐츠 영역 */}
      <div className="profile-content">
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
                      <p>{post.content?.substring(0, 60)}...</p>
                      <div className="post-stats">
                        {isPostRecruiting(post) ? (
                          <span className="post-status">
                            모집: {post.currentCount || 0}/{post.headCount || 0}
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
                      <p>{post.content?.substring(0, 60)}...</p>
                      <div className="post-stats">
                        {isPostRecruiting(post) ? (
                          <span className="post-status">
                            모집: {post.currentCount || 0}/{post.headCount || 0}
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
          <div className="section-header">
            <h3 className="section-title">받은 리뷰</h3>
            {!isMyProfile && userInfo && (
              <button
                className="add-btn"
                onClick={toggleReviewForm}
                style={{
                  backgroundColor: "#FFD54F",
                  color: "#333333",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isWritingReview ? "취소" : "+ 리뷰 작성"}
              </button>
            )}
          </div>

          {/* 리뷰 작성 폼 */}
          {isWritingReview && !isMyProfile && userInfo && (
            <div className="review-form-container">
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="postId">관련 프로젝트 (선택)</label>
                  <select
                    id="postId"
                    value={reviewPostId}
                    onChange={(e) =>
                      setReviewPostId(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="form-control"
                  >
                    <option value="">프로젝트 선택 (선택사항)</option>
                    {togetherPosts.length > 0 ? (
                      togetherPosts.map((post) => (
                        <option key={post.postId} value={post.postId}>
                          {post.postTitle}
                        </option>
                      ))
                    ) : (
                      <option disabled>함께한 프로젝트가 없습니다</option>
                    )}
                  </select>
                  {togetherPosts.length === 0 && (
                    <small className="form-text text-muted">
                      함께한 프로젝트가 없어도 리뷰를 작성할 수 있습니다.
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="reviewContent">리뷰 내용</label>
                  <textarea
                    id="reviewContent"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="form-control"
                    rows={4}
                    placeholder="이 사용자와의 협업 경험을 공유해주세요."
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    style={{
                      backgroundColor: "#FFD54F",
                      color: "#333333",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {editingReview ? "리뷰 수정" : "리뷰 등록"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 리뷰 목록 */}
          <div className="reviews-section">
            {reviews.length > 0 ? (
              <div className="reviews-container">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    userInfo={userInfo}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
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
