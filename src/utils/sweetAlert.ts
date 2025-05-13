import Swal from "sweetalert2";

// 성공 메시지 표시
export const showSuccess = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "성공",
    text: message,
    confirmButtonColor: "#FFD54F",
    confirmButtonText: "확인",
  });
};

// 에러 메시지 표시
export const showError = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "오류",
    text: message,
    confirmButtonColor: "#FFD54F",
    confirmButtonText: "확인",
  });
};

// 정보 메시지 표시
export const showInfo = (message: string) => {
  return Swal.fire({
    icon: "info",
    title: "안내",
    text: message,
    confirmButtonColor: "#FFD54F",
    confirmButtonText: "확인",
  });
};

// 경고 메시지 표시
export const showWarning = (message: string) => {
  return Swal.fire({
    icon: "warning",
    title: "주의",
    text: message,
    confirmButtonColor: "#FFD54F",
    confirmButtonText: "확인",
  });
};

// 확인 대화상자 표시
export const showConfirm = (
  title: string = "확인",
  message: string,
  confirmText: string = "확인",
  cancelText: string = "취소"
) => {
  return Swal.fire({
    icon: "question",
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#FFD54F",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  }).then((result) => {
    return result.isConfirmed;
  });
};

// Toast 메시지 표시
export const showToast = (
  message: string,
  icon: "success" | "error" | "warning" | "info" = "success"
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title: message,
  });
};

// 기본 alert 대체 함수
export const showAlert = (message: string) => {
  return Swal.fire({
    text: message,
    confirmButtonColor: "#FFD54F",
    confirmButtonText: "확인",
  });
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showConfirm,
  showToast,
  showAlert,
};
