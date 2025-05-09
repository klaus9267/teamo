import React, { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/common/LoginModal.css";
import { authApi } from "../../api/auth.ts";

const LoginModal = ({ onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  // 모달 컨테이너에 대한 ref 생성
  const modalRef = useRef(null);

  // 모달 바깥 영역 클릭 처리 함수 - useCallback으로 메모이제이션
  const handleOutsideClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // 입력값 검증 함수
  const validateField = (name, value) => {
    if (name === "username") {
      if (!value) return "아이디를 입력하세요.";
      if (value.length < 4) return "아이디는 4자 이상이어야 합니다.";
    }
    if (name === "password") {
      if (!value) return "비밀번호를 입력하세요.";
      if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (name === "name" && !isLoginMode) {
      if (!value) return "이름을 입력하세요.";
    }
    if (name === "email") {
      if (!value) return "이메일을 입력하세요.";
      // 간단한 이메일 형식 체크
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
        return "이메일 형식이 올바르지 않습니다.";
    }
    return "";
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
    setInputError((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSwitchToSignup = () => {
    setIsLoginMode(false);
    setApiError(null);
    setInputError({ username: "", password: "", name: "", email: "" });
    setFormData({ username: "", password: "", name: "", email: "" });
  };

  const handleSwitchToLogin = () => {
    setIsLoginMode(true);
    setApiError(null);
    setInputError({ username: "", password: "", name: "", email: "" });
    setFormData({ username: "", password: "", name: "", email: "" });
  };

  // 회원가입 전체 유효성 검사
  const validateSignupForm = () => {
    const errors = {
      username: validateField("username", formData.username),
      password: validateField("password", formData.password),
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
    };
    setInputError(errors);
    return !Object.values(errors).some((msg) => msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        // 로그인
        if (!formData.username || !formData.password) {
          setInputError((prev) => ({
            ...prev,
            username: validateField("username", formData.username),
            password: validateField("password", formData.password),
          }));
          setLoading(false);
          return;
        }
        console.log("[로그인 요청]", {
          username: formData.username,
          password: formData.password,
        });
        const res = await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        console.log("[로그인 응답]", res);
        onLogin();
        onClose();
      } else {
        // 회원가입
        if (!validateSignupForm()) {
          setLoading(false);
          return;
        }
        console.log("[회원가입 요청]", formData);
        const res = await authApi.signUp(formData);
        console.log("[회원가입 응답]", res);
        setIsLoginMode(true);
        setFormData({ username: "", password: "", name: "", email: "" });
      }
    } catch (err) {
      console.error("[API 에러]", err);
      setApiError(
        err.response?.data?.message ||
          (isLoginMode
            ? "잘못된 아이디 또는 비밀번호입니다."
            : "회원가입에 실패했습니다.")
      );
    } finally {
      setLoading(false);
    }
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
            <button
              className="social-button kakao-button"
              onClick={() => onLogin && onLogin()}
            >
              <img
                src="/icons/kakao-icon.svg"
                alt="Kakao"
                className="social-icon"
              />
              카카오 로그인
            </button>
            <button
              className="social-button google-button"
              onClick={() => onLogin && onLogin()}
            >
              <img
                src="/icons/google-icon.svg"
                alt="Google"
                className="social-icon"
              />
              구글 로그인
            </button>
            <button
              className="social-button github-button"
              onClick={() => onLogin && onLogin()}
            >
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
                  <label htmlFor="username">아이디</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {inputError.username && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.username}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {inputError.password && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.password}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "로그인 중..." : "로그인하기"}
                </button>
                {apiError && (
                  <div
                    className="input-error"
                    style={{
                      color: "#ff4d4f",
                      fontSize: "13px",
                      marginTop: "8px",
                    }}
                  >
                    {apiError}
                  </div>
                )}
                <p className="switch-mode">
                  계정이 없으신가요?{" "}
                  <span onClick={handleSwitchToSignup}>회원가입하기</span>
                </p>
              </>
            ) : (
              // 회원가입 폼
              <>
                <div className="form-group">
                  <label htmlFor="username">아이디</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {inputError.username && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.username}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="name">이름</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {inputError.name && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.name}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {inputError.email && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.email}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {inputError.password && (
                    <div
                      className="input-error"
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {inputError.password}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "가입 중..." : "회원가입하기"}
                </button>
                {apiError && (
                  <div
                    className="input-error"
                    style={{
                      color: "#ff4d4f",
                      fontSize: "13px",
                      marginTop: "8px",
                    }}
                  >
                    {apiError}
                  </div>
                )}
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
