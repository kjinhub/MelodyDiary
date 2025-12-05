import React from "react"; // <React.StrictMode>를 사용하려면 필요합니다.
import ReactDOM from "react-dom/client";
import "./index.css"; // index.css 파일이 있다면 유지합니다.
import App from "./App.jsx";

// 💡 수정 1: react-router-dom에서 BrowserRouter를 임포트합니다.
import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot는 그대로 유지합니다.
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
);
