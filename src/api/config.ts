import axios from "axios";
import { AUTH_TOKEN_KEY } from "./auth.ts";
import Swal from "sweetalert2";
import { showGlobalLoginModal } from "../utils/modalUtils.ts";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 동일한 오류 메시지를 반복해서 표시하지 않도록 관리하는 변수
let isAlertShowing = false;

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - 인증 에러 (토큰 만료 등)
      if (status === 401 && !isAlertShowing) {
        console.error(
          "인증이 필요합니다. 토큰이 유효하지 않거나 만료되었습니다."
        );

        // 토큰 제거
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem("token");

        // 로그인 페이지나 OAuth 콜백 페이지가 아닌 경우에만 로그인 알림 표시
        if (
          window.location.pathname !== "/login" &&
          !window.location.pathname.includes("/login/oauth2/code/") &&
          window.location.pathname !== "/auth"
        ) {
          isAlertShowing = true;

          // 특정 에러 메시지를 먼저 보여준 다음 인증 에러 알림 표시
          // error.config에서 URL을 확인하여 특정 API 요청에 대한 맞춤형 메시지 표시
          const url = error.config?.url || "";

          if (url.includes("/api/resumes")) {
            Swal.fire({
              icon: "error",
              title: "오류",
              text: "자기소개서 저장에 실패했습니다. 다시 시도해주세요.",
              confirmButtonColor: "#FFD54F",
              confirmButtonText: "확인",
            }).then(() => {
              // 자기소개서 오류 알림 후 인증 알림 표시
              Swal.fire({
                icon: "warning",
                title: "로그인 필요",
                text: "인증이 만료되었습니다. 다시 로그인해주세요.",
                confirmButtonColor: "#FFD54F",
                confirmButtonText: "확인",
                allowOutsideClick: false,
              }).then(() => {
                // 로그인 모달 표시
                showGlobalLoginModal();
                isAlertShowing = false;
              });
            });
          } else {
            // 기본 인증 오류 알림
            Swal.fire({
              icon: "warning",
              title: "로그인 필요",
              text: "인증이 만료되었습니다. 다시 로그인해주세요.",
              confirmButtonColor: "#FFD54F",
              confirmButtonText: "확인",
              allowOutsideClick: false,
            }).then(() => {
              // 로그인 모달 표시
              showGlobalLoginModal();
              isAlertShowing = false;
            });
          }
        }
      }

      // 403 Forbidden - 권한 없음
      else if (status === 403) {
        console.error("접근 권한이 없습니다.");
        Swal.fire({
          icon: "warning",
          title: "권한 없음",
          text: "해당 기능에 접근할 권한이 없습니다.",
          confirmButtonColor: "#FFD54F",
          confirmButtonText: "확인",
        });
      }

      // 404 Not Found - 리소스 없음
      else if (status === 404) {
        console.error("요청한 리소스를 찾을 수 없습니다.");
      }

      // 500 Internal Server Error - 서버 오류
      else if (status >= 500) {
        console.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        Swal.fire({
          icon: "error",
          title: "서버 오류",
          text: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          confirmButtonColor: "#FFD54F",
          confirmButtonText: "확인",
        });
      }

      // 그 외 에러
      else {
        console.error(
          `API 오류 (${status}): ${
            data?.message || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못한 경우 (네트워크 오류 등)
      console.error("서버로부터 응답이 없습니다. 인터넷 연결을 확인해주세요.");
      Swal.fire({
        icon: "error",
        title: "연결 오류",
        text: "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.",
        confirmButtonColor: "#FFD54F",
        confirmButtonText: "확인",
      });
    } else {
      // 요청 준비 중 에러
      console.error("요청 전송 중 오류가 발생했습니다:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
