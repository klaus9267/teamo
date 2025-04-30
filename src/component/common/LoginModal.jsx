import React, { useState, useRef, useEffect } from "react";
import "../../styles/common/LoginModal.css";

const LoginModal = ({ onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // 모달 컨테이너에 대한 ref 생성
  const modalRef = useRef(null);

  // 모달 바깥 영역 클릭 처리 함수
  const handleOutsideClick = (e) => {
    // 클릭된 요소가 모달 컨테이너 외부인 경우에만 닫기
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // 컴포넌트가 마운트될 때 이벤트 리스너 등록, 언마운트될 때 제거
  useEffect(() => {
    // 모달이 열려있을 때만 이벤트 리스너 추가
    document.addEventListener("mousedown", handleOutsideClick);

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSwitchToSignup = () => {
    setIsLoginMode(false);
  };

  const handleSwitchToLogin = () => {
    setIsLoginMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 로그인 또는 회원가입 처리 로직
    console.log(isLoginMode ? "로그인 시도" : "회원가입 시도");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <div className="modal-content">
          <h2 className="modal-title">
            {isLoginMode
              ? "Teamo에 로그인 합니다"
              : "Teamo에 오신 것을 환영합니다"}
          </h2>
          <p className="modal-subtitle">
            {isLoginMode
              ? "함께 할 팀원을 찾아보세요"
              : "새로운 팀과 함께 성장하세요"}
          </p>

          {/* 소셜 로그인 버튼 */}
          <div className="social-login-buttons">
            <button className="social-button kakao-button">
              <img
                src="/icons/kakao-icon.svg"
                alt="Kakao"
                className="social-icon"
              />
              카카오 로그인
            </button>
            <button className="social-button google-button">
              <img
                src="/icons/google-icon.svg"
                alt="Google"
                className="social-icon"
              />
              구글 로그인
            </button>
            <button className="social-button github-button">
              <img
                src="/icons/github-icon.svg"
                alt="GitHub"
                className="social-icon"
              />
              Github 로그인
            </button>
          </div>

          <div className="divider">
            <span>또는 이메일로 시작하기</span>
          </div>

          {/* 로그인/회원가입 폼 */}
          <form onSubmit={handleSubmit} className="login-form">
            {isLoginMode ? (
              // 로그인 폼
              <>
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  로그인하기
                </button>
                <p className="switch-mode">
                  계정이 없으신가요?{" "}
                  <span onClick={handleSwitchToSignup}>회원가입하기</span>
                </p>
              </>
            ) : (
              // 회원가입 폼
              <>
                <div className="form-group">
                  <label htmlFor="name">이름</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email">이메일</label>
                  <input
                    type="email"
                    id="signup-email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">비밀번호</label>
                  <input
                    type="password"
                    id="signup-password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  회원가입하기
                </button>
                <p className="switch-mode">
                  이미 계정이 있으신가요?{" "}
                  <span onClick={handleSwitchToLogin}>로그인하기</span>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
