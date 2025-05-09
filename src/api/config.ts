import axios from "axios";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - 인증 에러 (토큰 만료 등)
      if (status === 401) {
        console.error(
          "인증이 필요합니다. 토큰이 유효하지 않거나 만료되었습니다."
        );
        localStorage.removeItem("token");
        // 로그인 페이지로 자동 리다이렉트는 제거
      }

      // 403 Forbidden - 권한 없음
      else if (status === 403) {
        console.error("접근 권한이 없습니다.");
      }

      // 404 Not Found - 리소스 없음
      else if (status === 404) {
        console.error("요청한 리소스를 찾을 수 없습니다.");
      }

      // 500 Internal Server Error - 서버 오류
      else if (status >= 500) {
        console.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
    } else {
      // 요청 준비 중 에러
      console.error("요청 전송 중 오류가 발생했습니다:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
