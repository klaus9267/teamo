import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../../api/auth.ts';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  id_token?: string;
}

// 소셜 로그인 사용자 정보 인터페이스
interface SocialUserInfo {
  id: number | string; // 소셜 제공자가 제공하는 고유 ID
  provider: string; // 소셜 제공자 (kakao, google, github 등)
  social_id?: string; // 백엔드에서 사용할 수 있는 소셜 고유 ID
  connected_at?: string;
  properties?: any;
  kakao_account?: any;
  email?: string;
  name?: string;
  picture?: string;
  profile_image?: string;
  [key: string]: any; // 기타 제공자별 특수 필드
}

const SocialCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState('');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenResponse | null>(null);
  const [userInfo, setUserInfo] = useState<SocialUserInfo | null>(null);
  const [provider, setProvider] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // 에러 정보 로깅 함수
  const logError = (message: string, details?: any) => {
    console.error(message, details);
    setErrorDetails(prev => [...prev, `[${new Date().toISOString()}] ${message}${details ? '\n' + JSON.stringify(details, null, 2) : ''}`]);
  };

  // 인가 코드로 액세스 토큰 발급받기
  const getAccessToken = async (provider: string, code: string): Promise<TokenResponse> => {
    try {
      console.log(`${provider} 인가 코드로 액세스 토큰 발급 시도 중...`);

      if (provider === 'kakao') {
        // 카카오 로그인 토큰 요청을 위한 데이터 준비
        const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI || 'http://localhost:3000/login/oauth2/code/kakao';
        const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID || '';

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('redirect_uri', redirectUri);
        params.append('code', code);

        // 디버깅을 위한 요청 정보 로깅
        const requestInfo = {
          url: 'https://kauth.kakao.com/oauth/token',
          params: {
            grant_type: 'authorization_code',
            client_id: clientId,
            redirect_uri: redirectUri,
            code: code.substring(0, 10) + '...', // 코드 일부만 표시 (보안)
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        console.log('토큰 요청 정보:', requestInfo);
        setErrorDetails(prev => [...prev, `토큰 요청 정보:\n${JSON.stringify(requestInfo, null, 2)}`]);

        // Content-Type을 application/x-www-form-urlencoded로 설정하여 CORS 이슈 해결
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });

        console.log('카카오 토큰 응답:', tokenResponse.data);
        return tokenResponse.data;
      } else {
        throw new Error(`현재 ${provider} 제공자는 구현되지 않았습니다.`);
      }
    } catch (error: any) {
      logError(`${provider} 액세스 토큰 발급 실패:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw new Error(error.response?.data?.error_description || error.message || `${provider} 액세스 토큰 발급 실패`);
    }
  };

  // 액세스 토큰으로 사용자 정보 가져오기
  const getUserInfo = async (provider: string, accessToken: string): Promise<SocialUserInfo> => {
    try {
      console.log(`${provider} 액세스 토큰으로 사용자 정보 조회 중...`);

      if (provider === 'kakao') {
        // 디버깅을 위한 요청 정보 로깅
        const requestInfo = {
          url: 'https://kapi.kakao.com/v2/user/me',
          headers: {
            Authorization: `Bearer ${accessToken.substring(0, 10)}...`, // 토큰 일부만 표시 (보안)
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        console.log('사용자 정보 요청 정보:', requestInfo);
        setErrorDetails(prev => [...prev, `사용자 정보 요청 정보:\n${JSON.stringify(requestInfo, null, 2)}`]);

        // 카카오 사용자 정보 요청
        const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });

        const kakaoUserInfo = userInfoResponse.data;
        console.log('카카오 사용자 정보:', kakaoUserInfo);

        // 응답 데이터를 표준 형식으로 변환
        const standardUserInfo: SocialUserInfo = {
          id: kakaoUserInfo.id,
          provider: 'kakao',
          social_id: `kakao_${kakaoUserInfo.id}`,
          connected_at: kakaoUserInfo.connected_at,
          properties: kakaoUserInfo.properties,
          kakao_account: kakaoUserInfo.kakao_account,
          email: kakaoUserInfo.kakao_account?.email,
          name: kakaoUserInfo.properties?.nickname,
          profile_image: kakaoUserInfo.properties?.profile_image,
        };

        return standardUserInfo;
      } else {
        throw new Error(`현재 ${provider} 제공자는 구현되지 않았습니다.`);
      }
    } catch (error: any) {
      logError(`${provider} 사용자 정보 가져오기 실패:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw new Error(error.response?.data?.error_description || error.message || `${provider} 사용자 정보 가져오기 실패`);
    }
  };

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // 현재 URL 정보 기록 (디버깅용)
        const currentUrl = window.location.href;
        const debugInfo = `Full URL: ${currentUrl}\nPath: ${location.pathname}\nSearch: ${location.search}\nHash: ${location.hash}`;
        console.log('디버깅 정보:', debugInfo);
        setDebug(debugInfo);

        // URL에서 code 파라미터 추출
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        // 프로바이더 결정
        let detectedProvider;

        if (location.pathname.includes('/login/oauth2/code/')) {
          // /login/oauth2/code/:provider 형식인 경우
          const pathSegments = location.pathname.split('/');
          detectedProvider = pathSegments[pathSegments.length - 1];
        } else if (location.pathname === '/auth') {
          // /auth 경로로 리다이렉트된 경우, 쿼리 파라미터나 다른 정보로 프로바이더 판단
          // 예: 카카오의 경우 'scope' 파라미터 존재 여부로 판단 가능
          if (params.has('scope') && params.get('scope')?.includes('profile')) {
            detectedProvider = 'kakao';
          } else {
            // 기본값으로 kakao 설정 (실제로는 더 정확한 구분 로직이 필요할 수 있음)
            detectedProvider = 'kakao';
          }
        } else {
          // 알 수 없는 경로
          const errorMsg = '지원되지 않는 소셜 로그인 경로입니다.';
          logError(errorMsg, { path: location.pathname });
          setError(errorMsg);
          setLoading(false);
          return;
        }

        // 프로바이더 저장
        setProvider(detectedProvider);

        console.log('Detected provider:', detectedProvider);
        console.log(`Received code from ${detectedProvider}:`, code ? `${code.substring(0, 10)}...` : null);
        console.log('State:', state);
        setErrorDetails(prev => [...prev, `감지된 제공자: ${detectedProvider}`, `인증 코드: ${code ? `${code.substring(0, 10)}...` : '없음'}`, `상태 값: ${state || '없음'}`]);

        if (!code) {
          const errorMsg = '인증 코드를 찾을 수 없습니다.';
          logError(errorMsg);
          setError(errorMsg);
          setLoading(false);
          return;
        }

        try {
          // 1. 인가 코드로 액세스 토큰 발급받기
          console.log(`${detectedProvider} 인가 코드로 액세스 토큰 발급 시도...`);
          const tokenData = await getAccessToken(detectedProvider, code);
          console.log('발급받은 토큰 정보:', {
            ...tokenData,
            access_token: tokenData.access_token ? `${tokenData.access_token.substring(0, 10)}...` : null,
            refresh_token: tokenData.refresh_token ? `${tokenData.refresh_token.substring(0, 10)}...` : null,
          });
          setTokenInfo(tokenData);

          // 2. 액세스 토큰으로 사용자 정보 가져오기
          console.log(`${detectedProvider} 액세스 토큰으로 사용자 정보 조회 시도...`);
          const retrievedUserInfo = await getUserInfo(detectedProvider, tokenData.access_token);
          console.log('가져온 사용자 정보:', retrievedUserInfo);
          setUserInfo(retrievedUserInfo);

          // 3. 백엔드에 사용자 정보와 액세스 토큰 전송 (선택적)
          if (process.env.REACT_APP_SEND_TO_BACKEND === 'true') {
            console.log(`백엔드 서버에 ${detectedProvider} 로그인 정보 전송 중...`);
            try {
              const response = await authApi.socialLoginWithToken(detectedProvider, tokenData.access_token, retrievedUserInfo);
              console.log('백엔드 응답:', response);
            } catch (backendError: any) {
              logError('백엔드 통신 오류:', backendError);
              // 백엔드 전송 실패해도 프론트엔드에서는 계속 진행
            }
          }

          // 로딩 상태 해제 (성공 페이지 표시)
          setLoading(false);
        } catch (apiError: any) {
          logError('소셜 로그인 처리 오류:', apiError);
          setError(`소셜 로그인 처리 중 오류가 발생했습니다: ${apiError.message}`);
          setLoading(false);
        }
      } catch (err: any) {
        logError('Error processing OAuth callback:', err);
        setError(`소셜 로그인 처리 중 오류가 발생했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    processOAuthCallback();
  }, [location, navigate]);

  // 토큰 및 사용자 정보 표시 헬퍼 함수
  const formatJSON = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  if (loading) {
    return (
      <div
        className="social-callback-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h2>소셜 로그인 처리 중...</h2>
        <p>액세스 토큰을 발급받고 사용자 정보를 조회하는 중입니다.</p>
        {process.env.NODE_ENV === 'development' && (
          <>
            {debug && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#f0f0f0',
                  borderRadius: '5px',
                  maxWidth: '80%',
                  overflowX: 'auto',
                }}
              >
                <h4>디버깅 정보:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{debug}</pre>
              </div>
            )}

            {errorDetails.length > 0 && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#fff0f0',
                  borderRadius: '5px',
                  maxWidth: '80%',
                  overflowX: 'auto',
                  border: '1px solid #ffcccc',
                }}
              >
                <h4>에러 및 로그 정보:</h4>
                {errorDetails.map((detail, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{detail}</pre>
                    {index < errorDetails.length - 1 && <hr style={{ border: '0.5px dashed #ffcccc' }} />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="social-callback-error"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          color: '#ff4d4f',
        }}
      >
        <h2>로그인 오류</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          홈으로 돌아가기
        </button>
        {process.env.NODE_ENV === 'development' && (
          <>
            {debug && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#f0f0f0',
                  borderRadius: '5px',
                  maxWidth: '80%',
                  overflowX: 'auto',
                }}
              >
                <h4>디버깅 정보:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{debug}</pre>
              </div>
            )}

            {errorDetails.length > 0 && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#fff0f0',
                  borderRadius: '5px',
                  maxWidth: '80%',
                  overflowX: 'auto',
                  border: '1px solid #ffcccc',
                }}
              >
                <h4>에러 및 로그 정보:</h4>
                {errorDetails.map((detail, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{detail}</pre>
                    {index < errorDetails.length - 1 && <hr style={{ border: '0.5px dashed #ffcccc' }} />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // 성공 페이지 - 토큰 및 사용자 정보 표시
  return (
    <div
      className="social-callback-success"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        color: '#52c41a',
        padding: '20px',
      }}
    >
      <h2>로그인 성공! ({provider} 로그인)</h2>

      {userInfo && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#e6f7ff',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '800px',
            border: '1px solid #91d5ff',
          }}
        >
          <h3>사용자 정보</h3>
          <div
            style={{
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              background: '#fff',
              border: '1px solid #d9d9d9',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>소셜 ID:</th>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{userInfo.social_id}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>제공자:</th>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{userInfo.provider}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>이메일:</th>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{userInfo.email}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>이름:</th>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{userInfo.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            <h4>전체 사용자 정보</h4>
            <pre>{formatJSON(userInfo)}</pre>
          </div>
        </div>
      )}

      {tokenInfo && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f6ffed',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '800px',
            border: '1px solid #b7eb8f',
          }}
        >
          <h3>액세스 토큰 정보</h3>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            <pre>{formatJSON(tokenInfo)}</pre>
          </div>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && errorDetails.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#fffbe6',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '800px',
            border: '1px solid #ffe58f',
          }}
        >
          <h3>디버깅 로그</h3>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            {errorDetails.map((detail, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{detail}</pre>
                {index < errorDetails.length - 1 && <hr style={{ border: '0.5px dashed #d9d9d9' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default SocialCallback;
