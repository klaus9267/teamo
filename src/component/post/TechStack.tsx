import React, { useState } from "react";
import "../../styles/post/TechStack.css";

interface TechStackProps {
  technologies?: string[];
  onSelectTech?: (tech: string) => void;
}

// 기술 스택별 아이콘 매핑
const techIcons: { [key: string]: string } = {
  // 프론트엔드 프레임워크/라이브러리
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  Angular:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  Next: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  Nuxt: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
  Svelte:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
  Redux:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  Preact:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/preact/preact-original.svg",
  Alpine:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/alpinejs/alpinejs-original.svg",
  Lit: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lit/lit-original.svg",
  Ember:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ember/ember-original-wordmark.svg",
  Backbone:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/backbonejs/backbonejs-original.svg",
  Polymer:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/polymer/polymer-original.svg",
  jQuery:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
  ThreeJS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
  D3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg",

  // UI 라이브러리
  "Styled-Components":
    "https://avatars.githubusercontent.com/u/20658825?s=200&v=4",
  MUI: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
  TailwindCSS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  Bootstrap:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  Sass: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "Ant Design":
    "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  Chakra: "https://img.stackshare.io/service/12421/chakra-ui.png",
  Bulma:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bulma/bulma-plain.svg",
  Stylus:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stylus/stylus-original.svg",
  Less: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg",
  PostCSS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postcss/postcss-original.svg",

  // 백엔드 언어/프레임워크
  NodeJS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  Python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "C++":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  Scala:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
  Perl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
  Clojure:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg",
  Haskell:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
  Erlang:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/erlang/erlang-original.svg",
  Elixir:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
  CoffeeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coffeescript/coffeescript-original.svg",
  Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  Julia:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg",
  Lua: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
  Matlab:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
  R: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
  Crystal:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/crystal/crystal-original.svg",

  // 백엔드 프레임워크
  Express:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  NestJS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg",
  Spring:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  FastAPI: "https://cdn.worldvectorlogo.com/logos/fastapi.svg",
  Django:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  Flask:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  Laravel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
  Rails:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain.svg",
  "NET Framework":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
  "ASP.NET":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg",
  CakePHP:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cakephp/cakephp-original.svg",
  Symfony:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg",
  CodeIgniter:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg",
  Drupal:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drupal/drupal-original.svg",
  Zend: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zend/zend-plain.svg",
  Magento:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg",
  WordPress:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
  Joomla:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/joomla/joomla-original.svg",

  // 데이터베이스
  MySQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  MongoDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  Redis:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  SQLite:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  Oracle:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
  Cassandra:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg",
  DynamoDB:
    "https://cdn.iconscout.com/icon/free/png-256/free-dynamodb-5363103-4488910.png",
  MariaDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
  CouchDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchdb/couchdb-original.svg",
  Neo4j:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg",
  ArangoDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arangodb/arangodb-original.svg",

  // 클라우드/인프라
  AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  Azure:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  GCP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  Kubernetes:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  Terraform:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  Heroku:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg",
  Netlify: "https://cdn.worldvectorlogo.com/logos/netlify.svg",
  Vercel: "https://www.svgrepo.com/show/354513/vercel.svg",
  DigitalOcean:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg",
  OpenShift:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openshift/openshift-original.svg",
  Vagrant:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg",

  // 개발 도구
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  Github:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  GitLab:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
  Bitbucket:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
  Webpack:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",
  Babel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg",
  Vite: "https://vitejs.dev/logo.svg",
  Grunt:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grunt/grunt-original.svg",
  Gulp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg",
  Yarn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg",
  NPM: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  PNPM: "https://cdn.worldvectorlogo.com/logos/pnpm.svg",
  ESLint:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg",
  Prettier: "https://cdn.worldvectorlogo.com/logos/prettier-2.svg",
  VSCode:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",

  // 테스트
  Jest: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
  Cypress: "https://asset.brandfetch.io/idFdo8ulhr/idzj0L0H_s.png",
  Mocha:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mocha/mocha-plain.svg",
  Jasmine:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jasmine/jasmine-plain.svg",
  Selenium:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg",
  Storybook:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
  Cucumber:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cucumber/cucumber-plain.svg",
  Karma:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/karma/karma-original.svg",
  Protractor:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/protractor/protractor-plain.svg",
  Puppeteer: "https://cdn.worldvectorlogo.com/logos/puppeteer.svg",
  Pytest:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytest/pytest-original.svg",

  // API/통신
  GraphQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  Swagger:
    "https://static-00.iconduck.com/assets.00/swagger-icon-512x512-halz44im.png",
  Apollo: "https://cdn.worldvectorlogo.com/logos/apollo-graphql-compact.svg",
  gRPC: "https://grpc.io/img/logos/grpc-icon-color.png",
  Socketio:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",
  RabbitMQ:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg",
  Kafka:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",

  // 모바일
  Flutter:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  Swift:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  Kotlin:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  "React Native":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  Xamarin:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xamarin/xamarin-original.svg",
  Ionic:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg",
  Cordova:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
  Android:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  Capacitor: "https://cdn.worldvectorlogo.com/logos/capacitorjs-icon.svg",

  // 기타
  Firebase:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  Electron:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg",
  Figma:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  Sketch:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg",
  Photoshop:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
  Illustrator:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
  Nginx:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
  Apache:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
  Jenkins:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
  Travis:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-plain.svg",
  CircleCI:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg",
  "GitHub Actions":
    "https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg",
  Jira: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
  Confluence:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg",
  Slack:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
  Trello:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
  Markdown:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg",
  Jupyter:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  Raspberry:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg",
  Arduino:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg",
  TensorFlow:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  PyTorch:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  Linux:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  Ubuntu:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg",
  Debian:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg",
  CentOS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/centos/centos-original.svg",
  OpenSUSE:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opensuse/opensuse-original.svg",
  Fedora:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fedora/fedora-original.svg",
  "Alpine Linux":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/alpinelinux/alpinelinux-original.svg",
  Windows:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
  Apple:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
  Anaconda:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg",
  Auth0:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/auth0/auth0-original.svg",
  Oauth:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oauth/oauth-original.svg",
  Handlebars:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/handlebars/handlebars-original.svg",
  Pug: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pug/pug-original.svg",
  EJS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ejs/ejs-original.svg",
  Pandas:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  NumPy:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  OpenCV:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
  Godot:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg",
  Unity:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
  Blender:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
};

// 물음표(기본) 아이콘 경로
const defaultIcon = "/icons/question-mark.svg";

const TechStack = ({ technologies = [], onSelectTech }: TechStackProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 검색어 변경 시 호출되는 함수
  const handleSearchChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // 검색어와 일치하는 기술 스택 찾기
    const filteredTechs = Object.keys(techIcons).filter(
      (tech) =>
        tech.toLowerCase().includes(value.toLowerCase()) &&
        !technologies.includes(tech)
    );

    setSuggestions(filteredTechs);
    setShowSuggestions(true);
  };

  // 기술 스택 선택 시 호출되는 함수
  const handleSelectTech = (tech: string) => {
    if (onSelectTech) {
      onSelectTech(tech);
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 직접 입력한 기술 스택 추가
  const handleAddCustomTech = () => {
    if (
      searchTerm.trim() &&
      !technologies.includes(searchTerm.trim()) &&
      onSelectTech
    ) {
      onSelectTech(searchTerm.trim());
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 편집 기능이 필요 없는 경우 (게시글 상세보기 등)
  if (!onSelectTech) {
    return (
      <div className="tech-stack-section">
        <h3 className="tech-stack-title">기술/언어</h3>
        {technologies.length === 0 ? (
          <p className="no-tech-message">선택된 기술 스택이 없습니다.</p>
        ) : (
          <div className="tech-stack-icons">
            {technologies.map((tech) => (
              <div key={tech} className="tech-icon-wrapper">
                <img
                  src={techIcons[tech] || defaultIcon}
                  alt={tech}
                  className="tech-icon"
                />
                <span className="tech-name">{`#${tech}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!technologies || technologies.length === 0) {
    return (
      <div className="tech-stack-section">
        <h3 className="tech-stack-title">기술/언어</h3>
        <div className="tech-search-container">
          <input
            type="text"
            className="tech-search-input"
            placeholder="기술 스택 검색 (예: React, Node.js)"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {showSuggestions && (
            <div className="tech-suggestions">
              {suggestions.length > 0
                ? suggestions.slice(0, 10).map((tech) => (
                    <div
                      key={tech}
                      className="tech-suggestion-item"
                      onClick={() => handleSelectTech(tech)}
                    >
                      <img
                        src={techIcons[tech] || defaultIcon}
                        alt={tech}
                        className="tech-suggestion-icon"
                      />
                      <span>{tech}</span>
                    </div>
                  ))
                : searchTerm.trim() && (
                    <div
                      className="tech-suggestion-item custom-tech-item"
                      onClick={handleAddCustomTech}
                    >
                      <span className="custom-tech-label">직접 입력:</span>
                      <span className="custom-tech-value">{searchTerm}</span>
                    </div>
                  )}
            </div>
          )}
        </div>
        <p className="no-tech-message">선택된 기술 스택이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="tech-stack-section">
      <h3 className="tech-stack-title">기술/언어</h3>
      <div className="tech-search-container">
        <input
          type="text"
          className="tech-search-input"
          placeholder="기술 스택 검색 (예: React, Node.js)"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {showSuggestions && (
          <div className="tech-suggestions">
            {suggestions.length > 0
              ? suggestions.slice(0, 10).map((tech) => (
                  <div
                    key={tech}
                    className="tech-suggestion-item"
                    onClick={() => handleSelectTech(tech)}
                  >
                    <img
                      src={techIcons[tech] || defaultIcon}
                      alt={tech}
                      className="tech-suggestion-icon"
                    />
                    <span>{tech}</span>
                  </div>
                ))
              : searchTerm.trim() && (
                  <div
                    className="tech-suggestion-item custom-tech-item"
                    onClick={handleAddCustomTech}
                  >
                    <span className="custom-tech-label">직접 입력:</span>
                    <span className="custom-tech-value">{searchTerm}</span>
                  </div>
                )}
          </div>
        )}
      </div>
      <div className="tech-stack-icons">
        {technologies.map((tech) => (
          <div key={tech} className="tech-icon-wrapper">
            <img
              src={techIcons[tech] || defaultIcon}
              alt={tech}
              className="tech-icon"
            />
            <span className="tech-name">{`#${tech}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
