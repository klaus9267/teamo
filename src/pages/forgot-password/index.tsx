import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/forgot-password/ForgotPasswordPage.css";
import { authApi } from "../../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      navigate("/login"); // 비밀번호 변경 성공 시 로그인 페이지로 이동
    } catch (err) {
      setError("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1>비밀번호 변경</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
            <input
              type="password"
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              value={formData.newPasswordConfirm}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="change-password-button"
            disabled={loading}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
