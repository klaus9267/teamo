import Swal from "sweetalert2";
import { createRoot, Root } from "react-dom/client";
import LoginModal from "../component/common/LoginModal";
import React from "react";

// 전역 상태 관리를 위한 변수
let loginModalContainer: HTMLDivElement | null = null;
let loginModalRoot: Root | null = null;

// 로그인 모달을 전역적으로 표시하는 함수
export const showGlobalLoginModal = (): void => {
  // 이미 존재하는 모달 컨테이너가 있다면 제거
  if (loginModalContainer && document.body.contains(loginModalContainer)) {
    document.body.removeChild(loginModalContainer);
    loginModalRoot = null;
  }

  // 새 모달 컨테이너 생성
  loginModalContainer = document.createElement("div");
  loginModalContainer.id = "global-login-modal-container";
  document.body.appendChild(loginModalContainer);

  // 모달 닫기 함수
  const handleClose = (): void => {
    if (loginModalContainer && document.body.contains(loginModalContainer)) {
      // 부드러운 제거를 위해 애니메이션 후 DOM에서 제거
      loginModalContainer.style.opacity = "0";
      setTimeout(() => {
        if (
          loginModalContainer &&
          document.body.contains(loginModalContainer)
        ) {
          document.body.removeChild(loginModalContainer);
          loginModalContainer = null;
          loginModalRoot = null;
        }
      }, 300);
    }
  };

  // 로그인 성공 핸들러
  const handleLogin = (): void => {
    handleClose();
    // 페이지 새로고침 없이 현재 페이지 유지
    window.location.reload();
  };

  // React 컴포넌트를 DOM에 렌더링
  if (loginModalContainer) {
    loginModalRoot = createRoot(loginModalContainer);
    loginModalRoot.render(
      React.createElement(LoginModal, {
        onClose: handleClose,
        onLogin: handleLogin,
      })
    );

    // 쉬운 접근을 위해 컨테이너 스타일링
    loginModalContainer.style.position = "fixed";
    loginModalContainer.style.top = "0";
    loginModalContainer.style.left = "0";
    loginModalContainer.style.width = "100%";
    loginModalContainer.style.height = "100%";
    loginModalContainer.style.zIndex = "9999";
    loginModalContainer.style.transition = "opacity 0.3s ease";
    loginModalContainer.style.opacity = "0";

    // 애니메이션을 위해 지연 후 표시
    setTimeout(() => {
      if (loginModalContainer) {
        loginModalContainer.style.opacity = "1";
      }
    }, 10);
  }
};

// 로그인 모달 닫기 함수
export const closeGlobalLoginModal = (): void => {
  if (loginModalContainer && document.body.contains(loginModalContainer)) {
    loginModalContainer.style.opacity = "0";
    setTimeout(() => {
      if (loginModalContainer && document.body.contains(loginModalContainer)) {
        document.body.removeChild(loginModalContainer);
        loginModalContainer = null;
        loginModalRoot = null;
      }
    }, 300);
  }
};
