import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/post/PostDetailPage.css";
import TechStack from "../../component/post/TechStack.tsx";
import TeamMembers from "../../component/post/TeamMembers.tsx";
import Comment from "../../component/post/Comment.tsx";

// 인터페이스 정의
interface PostData {
  id: number;
  title: string;
  category: string;
  content: {
    motivation: string;
    product: string;
    target: string;
    meeting: string;
    meetingType: string;
    experience: string;
    etc: string;
  };
  leader: {
    id: number;
    name: string;
    avatar: string;
    email: string;
    isLeader: boolean;
    skills?: string[];
  };
  members: Array<{
    id: number;
    name: string;
    avatar: string;
    skills?: string[];
  }>;
  techStacks: string[];
  applyStatus: {
    current: number;
    total: number;
  };
  meetingType: string;
  endDate: string;
  comments?: Array<{
    id: number;
    author: {
      id: number;
      name: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
    replies?: any[];
  }>;
}

// 지원 상태 타입 정의
type ApplicationStatus = "none" | "applied" | "accepted";

// 지원자 정보 인터페이스
interface Applicant {
  id: number;
  name: string;
  avatar: string;
  applyDate: string;
  skills: string[];
  resumeTitle: string;
  resumeContent: string;
}

// 자기소개서 인터페이스
interface Resume {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// 더미 데이터 - 실제로는 API 호출로 대체
const postsData: PostData[] = [
  {
    id: 1,
    title: "[서울] Kettodze - 일본 가챠 매장",
    category: "프로젝트",
    content: {
      motivation: `안녕하세요. 가챠 매장 찾기 앱 Kettodze를 개발 중인 눌엉이입니다.
저는 n년 차 오타쿠로, 강남이나 국전 근처를 방문할 때마다 가챠를 즐기곤 합니다.
하지만 매번 "오늘은 어떤 가챠가 있을까?" 하는 기대감으로 방문하면서도, 정작 원하는 가챠를 찾는 데 어려움을 겪곤 했습니다.
이런 불편함을 해결하고자, 가챠 매장 정보를 손쉽게 찾을 수 있는 앱, Kettodze를 개발하게 되었습니다.`,
      product: `현재는 수익성보다는 개인 토이 프로젝트로 혼자 진행하고 있습니다.
갓챠를 판매하는 사이트의 개념보다는, 근처에 어떤 갓챠 매장이 있는지 알려주는 앱입니다. (중개앱)`,
      target: "가챠 좋아하는 사람들",
      meeting: "1주일에 1회 정도 정기적으로 회의",
      meetingType: "논의 후에 결정할게요",
      experience: `그동안 주로 개발과 기획, UI/UX 기본 작업을 담당해왔습니다.
연차가 많지는 않지만(4년차), 누구보다 열심히 개발하고 성장해나갈 각오로 임하고 있습니다.
지원해주시는 분들께는 높은 개발 역량보다는, 이 프로젝트에 대한 애정과 긍정적인 태도(덕량)를 더 중요하게 생각하고 있습니다.`,
      etc: `현재 약 4년 차 개발자로, 이번 프로젝트의 초기 작업을 진행하고 있습니다.
함께 하게 된다면, 자신의 전문 분야에 한정되지 않고 다양한 업무를 경험할 수 있습니다.
때로는 맨땅에서 시작하는 일도 있을 수 있습니다.
단순히 포트폴리오에 한 줄 추가하는 것을 목표로 하기보다는,
정말로 이 앱이 우리 같은 갓챠맨들에게 실질적인 도움이 되었으면 하는 마음으로 함께 해주셨으면 합니다.
현재 총 3명의 팀원을 모집하고 있으며, 프로젝트 진행 상황과 팀 논의에 따라 추후 확장될 가능성도 있습니다.`,
    },
    leader: {
      id: 1,
      name: "눌엉이",
      avatar: "https://via.placeholder.com/48x48.png?text=User",
      email: "nool@sample.com",
      isLeader: true,
      skills: ["React", "TypeScript", "Node.js"],
    },
    members: [
      {
        id: 2,
        name: "니누느",
        avatar: "https://via.placeholder.com/48x48.png?text=Member1",
        skills: ["Node.js", "Express", "MongoDB", "AWS"],
      },
      {
        id: 3,
        name: "이수수",
        avatar: "https://via.placeholder.com/48x48.png?text=Member2",
        skills: ["Figma", "Adobe XD", "Photoshop", "반응형 웹"],
      },
    ],
    techStacks: [
      "React",
      "TypeScript",
      "Styled-Components",
      "NodeJS",
      "MongoDB",
      "Figma",
    ],
    applyStatus: { current: 3, total: 5 },
    meetingType: "온라인",
    endDate: "2025-10-29",
    comments: [
      {
        id: 1,
        author: {
          id: 5,
          name: "참여자1",
          avatar: "https://via.placeholder.com/40",
        },
        content:
          "프로젝트에 관심이 있습니다. 지원하고 싶은데 어떻게 해야 할까요?",
        createdAt: "2023-04-15T09:24:00",
        replies: [
          {
            id: 2,
            author: {
              id: 1,
              name: "눌엉이",
              avatar: "https://via.placeholder.com/40",
            },
            content:
              "안녕하세요! 오른쪽 상단의 '지원하기' 버튼을 통해 지원해주시면 됩니다.",
            createdAt: "2023-04-15T10:30:00",
          },
        ],
      },
      {
        id: 3,
        author: {
          id: 6,
          name: "관심있는사람",
          avatar: "https://via.placeholder.com/40",
        },
        content: "프로젝트 일정이 어떻게 되나요? 주 몇회 정도 미팅이 있을까요?",
        createdAt: "2023-04-16T14:05:00",
      },
    ],
  },
  {
    id: 2,
    title: "투표와 기술대회 사업화전략 플랫폼",
    category: "공모전",
    content: {
      motivation:
        "기술 스타트업을 위한 효과적인 투표 시스템과 전략 플랫폼이 필요합니다.",
      product: "스타트업 사업화 전략을 투표로 결정하고 공유하는 플랫폼입니다.",
      target: "테크 스타트업 창업자, 투자자, 기획자",
      meeting: "주 2회 온라인 미팅",
      meetingType: "온라인 위주, 월 1회 오프라인",
      experience:
        "다양한 투표 시스템 개발 경험이 있으며 스타트업 생태계에 관심이 많습니다.",
      etc: "함께 좋은 서비스를 만들어나갈 열정 있는 분들을 찾고 있습니다.",
    },
    leader: {
      id: 10,
      name: "김창업",
      avatar: "https://via.placeholder.com/48x48.png?text=Kim",
      email: "startup@example.com",
      isLeader: true,
      skills: ["Spring", "Java", "MySQL"],
    },
    members: [],
    techStacks: ["Spring", "Java", "MySQL", "React", "AWS"],
    applyStatus: { current: 2, total: 5 },
    meetingType: "혼합",
    endDate: "2025-08-15",
    comments: [],
  },
  {
    id: 3,
    title: "AI 기반 추천 시스템 개발",
    category: "해커톤",
    content: {
      motivation:
        "사용자 행동 데이터를 바탕으로 정확한 추천을 제공하는 시스템을 만들고 싶습니다.",
      product: "머신러닝 기반 맞춤형 콘텐츠 추천 알고리즘 개발",
      target: "콘텐츠 플랫폼 운영자, 데이터 과학자",
      meeting: "주 3회 온라인 스크럼",
      meetingType: "온라인",
      experience: "머신러닝과 데이터 분석 분야에서 5년간 일해왔습니다.",
      etc: "열정적이고 도전을 즐기는 팀원을 모집합니다.",
    },
    leader: {
      id: 15,
      name: "박데이터",
      avatar: "https://via.placeholder.com/48x48.png?text=Park",
      email: "data@example.com",
      isLeader: true,
      skills: ["Python", "TensorFlow", "MongoDB"],
    },
    members: [
      {
        id: 16,
        name: "이분석",
        avatar: "https://via.placeholder.com/48x48.png?text=Lee",
        skills: ["Python", "Pandas", "Data Analysis"],
      },
    ],
    techStacks: ["Python", "TensorFlow", "MongoDB", "Flask", "AWS"],
    applyStatus: { current: 2, total: 4 },
    meetingType: "온라인",
    endDate: "2024-12-20",
    comments: [],
  },
  {
    id: 4,
    title: "여행 동행 매칭 플랫폼",
    category: "프로젝트",
    content: {
      motivation:
        "여행 계획은 있지만 함께 갈 친구를 찾기 어려운 사람들을 위한 플랫폼입니다.",
      product:
        "여행 취향과 일정이 맞는 사람들을 연결해주는 소셜 매칭 서비스입니다.",
      target: "20-30대 여행 애호가, 솔로 여행객",
      meeting: "주 2회 온라인 회의, 필요시 오프라인 모임",
      meetingType: "온/오프라인 혼합",
      experience:
        "여행 관련 서비스 개발 경험이 있으며, 디자인과 마케팅에도 관심이 많습니다.",
      etc: "다양한 아이디어를 나눌 수 있는 열린 마인드의 팀원을 찾고 있습니다.",
    },
    leader: {
      id: 20,
      name: "여행가",
      avatar: "https://via.placeholder.com/48x48.png?text=Travel",
      email: "travel@example.com",
      isLeader: true,
      skills: ["React", "Firebase", "UI/UX"],
    },
    members: [
      {
        id: 21,
        name: "디자이너",
        avatar: "https://via.placeholder.com/48x48.png?text=Designer",
        skills: ["Figma", "Illustration", "UI/UX"],
      },
    ],
    techStacks: ["React", "Firebase", "Redux", "Node.js", "Express"],
    applyStatus: { current: 1, total: 4 },
    meetingType: "혼합",
    endDate: "2025-12-01",
    comments: [],
  },
];

// 더미 자기소개서 데이터
const dummyResumes: Resume[] = [
  {
    id: 1,
    title: "프론트엔드 개발자 자기소개서",
    content: "React와 TypeScript를 활용한 웹 개발 경험이 있습니다.",
    createdAt: "2023-05-01",
  },
  {
    id: 2,
    title: "백엔드 개발자 자기소개서",
    content: "Node.js와 Express를 활용한 API 개발 경험이 있습니다.",
    createdAt: "2023-05-15",
  },
  {
    id: 3,
    title: "디자이너 자기소개서",
    content: "UI/UX 디자인 경험이 있으며 사용자 중심의 디자인을 추구합니다.",
    createdAt: "2023-06-01",
  },
];

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("none");
  const [showApplicantsList, setShowApplicantsList] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // 지원 모달 관련 상태
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<number | null>(null);
  const [motivationText, setMotivationText] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);

  // 현재 로그인 유저 ID (실제로는 로그인 상태에서 가져옴)
  const currentUserId = 1; // 1번 유저로 설정 (1번 게시글의 작성자와 동일)

  useEffect(() => {
    // ID를 이용해 해당 게시글 찾기
    const postId = Number(id);
    try {
      // 실제 환경에서는 API 호출 대신 더미 데이터에서 찾기
      const foundPost = postsData.find((post) => post.id === postId);

      if (foundPost) {
        setPost(foundPost);

        // 현재 유저가 글 작성자인지 확인
        setIsAuthor(foundPost.leader.id === currentUserId);

        // 지원 상태 확인 (실제로는 API 호출)
        checkApplicationStatus(postId, currentUserId);

        // 지원자 목록 가져오기 (실제로는 API 호출)
        if (foundPost.leader.id === currentUserId) {
          fetchApplicants(postId);
        }

        // 사용자의 자기소개서 가져오기 (실제로는 API 호출)
        fetchUserResumes(currentUserId);
      } else {
        setError("게시글을 찾을 수 없습니다.");
      }
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching post data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 사용자의 자기소개서 가져오기 (실제로는 API 호출)
  const fetchUserResumes = (userId: number) => {
    // 더미 데이터로 설정
    setResumes(dummyResumes);
  };

  // 지원 상태 확인 함수 (실제로는 API 호출)
  const checkApplicationStatus = (postId: number, userId: number) => {
    // 더미 데이터: 임의로 2번 글에는 지원했고, 3번 글에는 합격한 상태로 설정
    if (postId === 2) {
      setApplicationStatus("applied");
    } else if (postId === 3) {
      setApplicationStatus("accepted");
    } else {
      setApplicationStatus("none");
    }
  };

  // 지원자 목록 가져오기 (실제로는 API 호출)
  const fetchApplicants = async (postId: number) => {
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await axios.get(`/api/posts/${postId}/applicants`);
      // setApplicants(response.data);

      // 임시로 더미 데이터 사용
      const dummyApplicants: Applicant[] = [
        {
          id: 5,
          name: "김서연",
          avatar: "https://via.placeholder.com/48x48.png?text=Kim",
          applyDate: "2023-04-28",
          skills: ["React", "TypeScript", "Next.js"],
          resumeTitle: "웹 프론트엔드 개발자 지원서",
          resumeContent:
            "React와 TypeScript를 활용한 웹 프론트엔드 개발 경험이 있습니다. 사용자 중심의 UI/UX에 관심이 많습니다. 특히 가챠 매장 정보를 쉽게 찾을 수 있는 앱을 만들어보고 싶어서 지원하게 되었습니다. 사용자 경험을 개선하는데 기여하고 싶습니다.",
        },
        {
          id: 6,
          name: "이지호",
          avatar: "https://via.placeholder.com/48x48.png?text=Lee",
          applyDate: "2023-04-27",
          skills: ["Node.js", "Express", "MongoDB"],
          resumeTitle: "백엔드 개발자 지원서",
          resumeContent:
            "Node.js와 Express를 활용한 RESTful API 개발 경험이 있습니다. 데이터베이스 설계 및 최적화에 관심이 많습니다. 가챠 매장 정보를 효율적으로 관리하고 제공하는 백엔드 시스템을 구축하는데 도움이 될 것 같습니다.",
        },
        {
          id: 7,
          name: "박민지",
          avatar: "https://via.placeholder.com/48x48.png?text=Park",
          applyDate: "2023-04-26",
          skills: ["Figma", "Adobe XD", "UI/UX"],
          resumeTitle: "디자이너 지원서",
          resumeContent:
            "Figma와 Adobe XD를 활용한 UI/UX 디자인 경험이 있습니다. 사용자 중심의 디자인을 추구합니다. 가챠 매장 정보를 직관적이고 아름답게 보여주는 디자인을 만들어보고 싶습니다.",
        },
      ];

      setApplicants(dummyApplicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("지원자 목록을 불러오는데 실패했습니다.");
    }
  };

  // 지원 승인/거절 처리 함수
  const handleApplicantAction = async (
    applicantId: number,
    action: "accept" | "reject"
  ) => {
    try {
      // TODO: 실제 API 호출로 대체
      // await axios.post(`/api/posts/${post?.id}/applicants/${applicantId}/${action}`);

      // 임시로 성공 메시지만 표시
      alert(
        action === "accept"
          ? "지원자를 승인했습니다."
          : "지원자를 거절했습니다."
      );

      // 지원자 목록 새로고침
      if (post) {
        fetchApplicants(post.id);
      }
    } catch (error) {
      console.error(`Error ${action}ing applicant:`, error);
      alert(`지원자 ${action === "accept" ? "승인" : "거절"}에 실패했습니다.`);
    }
  };

  // 지원하기 함수
  const handleApply = () => {
    if (applicationStatus === "applied") {
      alert("이미 지원한 모집글입니다.");
      return;
    }

    if (applicationStatus === "accepted") {
      alert(`이미 해당 ${post?.category}에 합류했습니다.`);
      return;
    }

    // 지원 모달 열기
    setShowApplyModal(true);
  };

  // 지원 제출 함수
  const handleSubmitApplication = () => {
    if (!selectedResume) {
      alert("자기소개서를 선택해주세요.");
      return;
    }

    // 실제로는 API 호출로 지원 처리
    alert("지원이 완료되었습니다.");
    setApplicationStatus("applied");
    setShowApplyModal(false);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedResume(null);
    setMotivationText("");
  };

  // 지원 상태별 알림 메시지 표시
  const handleAppliedClick = () => {
    alert("이미 지원한 모집글입니다. 지원 결과를 기다려주세요.");
  };

  const handleAcceptedClick = () => {
    alert(`이미 해당 ${post?.category}에 합류했습니다.`);
  };

  // 지원자 목록 토글 함수
  const toggleApplicantsList = () => {
    setShowApplicantsList(!showApplicantsList);
  };

  if (loading) {
    return <div className="post-detail-loading">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        {error || "게시글을 찾을 수 없습니다."}
      </div>
    );
  }

  return (
    <div className="post-detail-outer">
      <div className="post-detail-container">
        <div className="post-detail-main">
          <h1 style={{ textAlign: "left" }}>{post.title}</h1>

          {/* 지원자 목록 섹션 */}
          {isAuthor && showApplicantsList && (
            <section className="applicants-section">
              <h2 style={{ fontSize: 20, marginBottom: 15, textAlign: "left" }}>
                지원자 목록
              </h2>

              {applicants.length === 0 ? (
                <p>아직 지원자가 없습니다.</p>
              ) : (
                <div className="applicants-list">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="applicant-card">
                      <div className="applicant-header">
                        <img
                          src={applicant.avatar}
                          alt={`${applicant.name} 프로필`}
                          className="applicant-avatar"
                        />
                        <div className="applicant-info">
                          <div className="applicant-name">{applicant.name}</div>
                          <div className="applicant-date">
                            지원일: {applicant.applyDate}
                          </div>
                        </div>
                      </div>

                      <div className="applicant-resume">
                        <div className="applicant-resume-title">
                          {applicant.resumeTitle}
                        </div>
                        <p className="applicant-resume-content">
                          {applicant.resumeContent}
                        </p>
                      </div>

                      <div>
                        <div className="applicant-skills-label">보유 기술:</div>
                        <div className="applicant-skills-list">
                          {applicant.skills.map((skill, index) => (
                            <span key={index} className="applicant-skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="applicant-actions">
                        <button
                          className="accept-button"
                          onClick={() =>
                            handleApplicantAction(applicant.id, "accept")
                          }
                        >
                          승인
                        </button>
                        <button
                          className="reject-button"
                          onClick={() =>
                            handleApplicantAction(applicant.id, "reject")
                          }
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={toggleApplicantsList} className="close-button">
                닫기
              </button>
            </section>
          )}

          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, textAlign: "left" }}>
              1. 프로젝트의 시작 동기
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 왜 이 프로덕트를 만드시고 싶은지 적어주세요
              </b>
              <p
                style={{ margin: 0, whiteSpace: "pre-line", textAlign: "left" }}
              >
                {post.content.motivation}
              </p>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 만들고자 하는 프로덕트에 대해 알려주세요
              </b>
              <p
                style={{ margin: 0, whiteSpace: "pre-line", textAlign: "left" }}
              >
                {post.content.product}
              </p>
              <div style={{ margin: "8px 0", textAlign: "left" }}>
                <b>기술 스택:</b> {post.techStacks.join(", ")}
                <br />
                <b>현재 상태:</b> 개발 진행 중<br />
                <b>목표:</b> 사용자 친화적인 UI/UX를 통해 정보를 쉽고 편리하게
                제공하는 앱 개발
              </div>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 어떤 사용자들을 타겟하고 있는지 적어주세요
              </b>
              <p style={{ margin: 0, textAlign: "left" }}>
                {post.content.target}
              </p>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, textAlign: "left" }}>
              2. 회의 진행/모임 방식
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 1주에 몇번정도 회의나 모임을 진행할 계획인가요?
              </b>
              <p style={{ margin: 0, textAlign: "left" }}>
                {post.content.meeting}
              </p>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 온/오프라인 회의 진행시 진행방식을 적어주세요
              </b>
              <p style={{ margin: 0, textAlign: "left" }}>
                {post.content.meetingType}
              </p>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, textAlign: "left" }}>
              3. 저의 경험 및 역할
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b style={{ textAlign: "left", display: "block" }}>
                - Q. 재직시 전문적으로 담당한 업무나, 별도로 진행하신 팀
                프로젝트가 있으시다면 적어주세요
              </b>
              <p
                style={{ margin: 0, whiteSpace: "pre-line", textAlign: "left" }}
              >
                {post.content.experience}
              </p>
              <div style={{ margin: "8px 0", textAlign: "left" }}>
                <b>개발자 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18, textAlign: "left" }}>
                  <li style={{ textAlign: "left" }}>서버 및 API 개발 경험</li>
                  <li style={{ textAlign: "left" }}>
                    데이터베이스 설계 및 관리 능력
                  </li>
                  <li style={{ textAlign: "left" }}>
                    Node.js, Express, MongoDB/PostgreSQL 등 경험 (자유)
                  </li>
                </ul>
                <b>디자이너 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18, textAlign: "left" }}>
                  <li style={{ textAlign: "left" }}>웹/앱 디자인 경험</li>
                  <li style={{ textAlign: "left" }}>
                    Figma, Adobe XD 등 디자인 툴 활용 능력
                  </li>
                  <li style={{ textAlign: "left" }}>반응형 웹 디자인 경험</li>
                </ul>
                <b>기획자 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18, textAlign: "left" }}>
                  <li style={{ textAlign: "left" }}>
                    서비스 기획 및 프로젝트 관리 경험
                  </li>
                  <li style={{ textAlign: "left" }}>사용자 중심 사고방식</li>
                  <li style={{ textAlign: "left" }}>마케팅 경험</li>
                </ul>
              </div>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, textAlign: "left" }}>
              4. 기타
            </h2>
            <div
              style={{
                color: "#444",
                whiteSpace: "pre-line",
                textAlign: "left",
              }}
            >
              {post.content.etc}
            </div>
          </section>

          {/* 기술 스택 컴포넌트 */}
          <TechStack technologies={post.techStacks} />

          {/* 팀 멤버 컴포넌트 */}
          <TeamMembers leader={post.leader} members={post.members} />

          {/* 댓글 컴포넌트 */}
          <Comment comments={post.comments || []} postId={post.id} />
        </div>
      </div>

      {/* 오른쪽 배너 */}
      <aside className="post-detail-aside">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to={`/profile/${post.leader.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={post.leader.avatar}
              alt="리더 프로필"
              style={{ width: 48, height: 48, borderRadius: "50%" }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{post.leader.name}</div>
              <div style={{ fontSize: 13, color: "#888" }}>
                {post.leader.email}
              </div>
            </div>
          </Link>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 마감일</div>
          <div style={{ fontWeight: 600 }}>{post.endDate}</div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>진행 방식</div>
          <div style={{ fontWeight: 600 }}>{post.meetingType}</div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 완료</div>
          <div style={{ fontWeight: 600 }}>
            {post.applyStatus.current} / {post.applyStatus.total}
          </div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>기술 스택</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}
          >
            {post.techStacks.map((tech) => (
              <span className="tech-tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 지원하기/지원자 확인 버튼 */}
        <div className="aside-divider" />
        {isAuthor ? (
          <button
            onClick={() => navigate(`/post/${post.id}/applicants`)}
            className="apply-button"
          >
            지원자 목록 확인
          </button>
        ) : (
          <div>
            {applicationStatus === "applied" ? (
              <div className="applied-status">이미 지원한 모집글입니다</div>
            ) : applicationStatus === "accepted" ? (
              <div className="accepted-status">
                합류한 {post.category}입니다
              </div>
            ) : (
              <button onClick={handleApply} className="apply-button">
                지원하기
              </button>
            )}
          </div>
        )}
      </aside>

      {/* 지원하기 모달 */}
      {showApplyModal && (
        <div className="apply-modal-overlay">
          <div className="apply-modal">
            <div className="apply-modal-header">
              <h2>{post.title}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="apply-modal-content">
              <div className="apply-modal-info">
                <p>
                  스마트 컨트랙트 개발 경험이 있는 블록체인 개발자를 찾습니다.
                  5월 중순 3일간 진행되는 해커톤입니다.
                </p>
              </div>

              <div className="apply-form-section">
                <label htmlFor="resume-select">자기소개서 선택</label>
                <select
                  id="resume-select"
                  value={selectedResume || ""}
                  onChange={(e) =>
                    setSelectedResume(Number(e.target.value) || null)
                  }
                  className="resume-select"
                >
                  <option value="">자기소개서를 선택해주세요</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="apply-form-section">
                <label htmlFor="motivation-text">지원 동기 (선택사항)</label>
                <textarea
                  id="motivation-text"
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                  placeholder="지원 동기를 작성해주세요 (선택사항)"
                  className="motivation-textarea"
                />
              </div>
            </div>
            <div className="apply-modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                취소
              </button>
              <button className="submit-btn" onClick={handleSubmitApplication}>
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
