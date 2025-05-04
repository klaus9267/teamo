import React from "react";
import "../../styles/post/TechStack.css";

interface TechStackProps {
  technologies: string[];
}

// 기술 스택별 아이콘 매핑
const techIcons: { [key: string]: string } = {
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  Python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  NodeJS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  MySQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  MongoDB:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  Figma:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "Styled-Components":
    "https://avatars.githubusercontent.com/u/20658825?s=200&v=4",
  NestJS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg",
  Express:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  Flask:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  Django:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  Vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  Angular:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  Next: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  Nuxt: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  Laravel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
  Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  Rails:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain.svg",
  Sass: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  AWS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  Kubernetes:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  Redux:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  Webpack:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",
  Babel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg",
  Jest: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
  GraphQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  Firebase:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  Swift:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  Kotlin:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  Flutter:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
};

const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  return (
    <div className="tech-stack-section">
      <h3 className="tech-stack-title">기술/언어</h3>
      <div className="tech-stack-icons">
        {technologies.map((tech) => (
          <div key={tech} className="tech-icon-wrapper">
            <img
              src={techIcons[tech] || "https://via.placeholder.com/32"}
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
