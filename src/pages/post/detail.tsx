import React from "react";
import "../../styles/post/PostDetailPage.css";
import TechStack from "../../component/post/TechStack.tsx";
import TeamMembers from "../../component/post/TeamMembers.tsx";
import Comment from "../../component/post/Comment.tsx";

export default function PostDetail() {
  // 더미 데이터
  const leader = {
    id: 1,
    name: "눌엉이",
    avatar: "https://via.placeholder.com/48x48.png?text=User",
    email: "nool@sample.com",
    isLeader: true,
  };

  const members = [
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
  ];

  const endDate = "2025-10-29";
  const techStacks = [
    "React",
    "TypeScript",
    "Styled-Components",
    "NodeJS",
    "MongoDB",
    "Figma",
  ];
  const applyStatus = { current: 3, total: 5 };
  const meetingType = "온라인";

  const dummyComments = [
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
  ];

  return (
    <div className="post-detail-outer">
      <div className="post-detail-container">
        <div className="post-detail-main">
          <h1>[서울] Kettodze - 일본 가챠 매장</h1>

          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>
              1. 프로젝트의 시작 동기
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>- Q. 왜 이 프로덕트를 만드시고 싶은지 적어주세요</b>
              <p style={{ margin: 0 }}>
                안녕하세요. 가챠 매장 찾기 앱 <b>Kettodze</b>를 개발 중인
                눌엉이입니다.
                <br />
                저는 n년 차 오타쿠로, 강남이나 국전 근처를 방문할 때마다 가챠를
                즐기곤 합니다.
                <br />
                하지만 매번 "오늘은 어떤 가챠가 있을까?" 하는 기대감으로
                방문하면서도, 정작 원하는 가챠를 찾는 데 어려움을 겪곤 했습니다.
                <br />
                이런 불편함을 해결하고자, 가챠 매장 정보를 손쉽게 찾을 수 있는
                앱, <b>Kettodze</b>를 개발하게 되었습니다.
              </p>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>- Q. 만들고자 하는 프로덕트에 대해 알려주세요</b>
              <p style={{ margin: 0 }}>
                현재는 수익성보다는 개인 토이 프로젝트로 혼자 진행하고 있습니다.
                <br />
                갓챠를 판매하는 사이트의 개념보다는, 근처에 어떤 갓챠 매장이
                있는지 알려주는 앱입니다. (중개앱)
              </p>
              <div style={{ margin: "8px 0" }}>
                <b>기술 스택:</b> React, TypeScript, Styled-Components
                <br />
                <b>현재 상태:</b> 개발 진행 중<br />
                <b>목표:</b> 사용자 친화적인 UI/UX를 통해 가챠 매장 정보를 쉽고
                편리하게 제공하는 앱 개발
              </div>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>- Q. 어떤 사용자들을 타겟하고 있는지 적어주세요</b>
              <p style={{ margin: 0 }}>가챠 좋아하는 사람들</p>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>
              2. 회의 진행/모임 방식
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>- Q. 1주에 몇번정도 회의나 모임을 진행할 계획인가요?</b>
              <p style={{ margin: 0 }}>1주일에 1회 정도 정기적으로 회의</p>
            </div>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>- Q. 온/오프라인 회의 진행시 진행방식을 적어주세요</b>
              <p style={{ margin: 0 }}>논의 후에 결정할게요</p>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>
              3. 저의 경험 및 역할
            </h2>
            <div style={{ marginBottom: 10, color: "#444" }}>
              <b>
                - Q. 재직시 전문적으로 담당한 업무나, 별도로 진행하신 팀
                프로젝트가 있으시다면 적어주세요
              </b>
              <p style={{ margin: 0 }}>
                그동안 주로 개발과 기획, UI/UX 기본 작업을 담당해왔습니다.
                <br />
                연차가 많지는 않지만(4년차), 누구보다 열심히 개발하고 성장해나갈
                각오로 임하고 있습니다.
                <br />
                지원해주시는 분들께는 높은 개발 역량보다는, 이 프로젝트에 대한
                애정과 긍정적인 태도(덕량)를 더 중요하게 생각하고 있습니다.
              </p>
              <div style={{ margin: "8px 0" }}>
                <b>개발자 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>서버 및 API 개발 경험</li>
                  <li>데이터베이스 설계 및 관리 능력</li>
                  <li>Node.js, Express, MongoDB/PostgreSQL 등 경험 (자유)</li>
                </ul>
                <b>디자이너 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>웹/앱 디자인 경험</li>
                  <li>Figma, Adobe XD 등 디자인 툴 활용 능력</li>
                  <li>반응형 웹 디자인 경험</li>
                </ul>
                <b>기획자 (1명)</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>서비스 기획 및 프로젝트 관리 경험</li>
                  <li>사용자 중심 사고방식</li>
                  <li>마케팅 경험</li>
                </ul>
              </div>
            </div>
          </section>
          <section style={{ margin: "32px 0 0 0" }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>4. 기타</h2>
            <div style={{ color: "#444" }}>
              현재 약 4년 차 개발자로, 이번 프로젝트의 초기 작업을 진행하고
              있습니다.
              <br />
              함께 하게 된다면, 자신의 전문 분야에 한정되지 않고 다양한 업무를
              경험할 수 있습니다.
              <br />
              때로는 맨땅에서 시작하는 일도 있을 수 있습니다.
              <br />
              단순히 포트폴리오에 한 줄 추가하는 것을 목표로 하기보다는,
              <br />
              정말로 이 앱이 우리 같은 갓챠맨들에게 실질적인 도움이 되었으면
              하는 마음으로 함께 해주셨으면 합니다.
              <br />
              현재 총 3명의 팀원을 모집하고 있으며, 프로젝트 진행 상황과 팀
              논의에 따라 추후 확장될 가능성도 있습니다.
            </div>
          </section>

          {/* 기술 스택 컴포넌트 */}
          <TechStack technologies={techStacks} />

          {/* 팀 멤버 컴포넌트 */}
          <TeamMembers leader={leader} members={members} />

          {/* 댓글 컴포넌트 */}
          <Comment comments={dummyComments} postId={1} />
        </div>
      </div>

      {/* 오른쪽 배너 복원 */}
      <aside className="post-detail-aside">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={leader.avatar}
            alt="리더 프로필"
            style={{ width: 48, height: 48, borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{leader.name}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{leader.email}</div>
          </div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 마감일</div>
          <div style={{ fontWeight: 600 }}>{endDate}</div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>진행 방식</div>
          <div style={{ fontWeight: 600 }}>{meetingType}</div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>모집 완료</div>
          <div style={{ fontWeight: 600 }}>
            {applyStatus.current} / {applyStatus.total}
          </div>
        </div>
        <div className="aside-divider" />
        <div>
          <div style={{ fontSize: 14, color: "#888" }}>기술 스택</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}
          >
            {techStacks.map((tech) => (
              <span className="tech-tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
