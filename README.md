# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 환경 변수 설정 (.env 파일)

소셜 로그인 기능을 사용하기 위해서는 프로젝트 루트에 `.env.local` 파일을 생성하고 다음과 같이 환경 변수를 설정해야 합니다:

```
# API Base URL
REACT_APP_API_BASE_URL=http://localhost:8080

# 카카오 로그인 설정
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
REACT_APP_KAKAO_AUTH_URI=https://kauth.kakao.com/oauth/authorize
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/login/oauth2/code/kakao

# 구글 로그인 설정
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
REACT_APP_GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/v2/auth
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/login/oauth2/code/google

# Github 로그인 설정
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_GITHUB_CLIENT_SECRET=your_github_client_secret
REACT_APP_GITHUB_AUTH_URI=https://github.com/login/oauth/authorize
REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000/login/oauth2/code/github
```

### 환경 변수 사용 시 주의사항

1. React에서 환경 변수는 반드시 `REACT_APP_` 접두사로 시작해야 합니다.
2. `.env.local` 파일은 Git에 커밋되지 않으므로 개인 개발 환경에서 각자 설정해야 합니다.
3. 변경 후에는 애플리케이션을 재시작해야 변경사항이 적용됩니다.
4. 배포 환경에서는 호스팅 서비스(Vercel, Netlify 등)의 환경 변수 설정 기능을 이용하세요.
5. 소셜 로그인을 위해 필요한 CLIENT_SECRET은 각 플랫폼 개발자 콘솔에서 발급받을 수 있습니다.
   - Google: https://console.cloud.google.com/
   - GitHub: https://github.com/settings/developers
   - Kakao: https://developers.kakao.com/

### 보안 주의사항

CLIENT_SECRET 값은 보안상 중요한 정보이므로 프론트엔드 코드에서 직접 사용하는 것은 권장되지 않습니다. 실제 프로덕션 환경에서는 이러한 인증 로직을 백엔드에서 처리하는 것이 안전합니다.
