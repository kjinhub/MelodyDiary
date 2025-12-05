import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // 1. base: 프로덕션 모드일 때 /melodyWebP/ 경로를 사용
    base: mode === "production" ? "/melodyWebP/" : "/",

    // 2. build: 빌드 관련 설정
    build: {
      // 빌드 결과물이 저장될 디렉토리 (GitHub Pages 배포 시 유용)
      outDir: "docs",
    },

    // 3. plugins: 사용할 플러그인 목록
    plugins: [
      react(), // React 프로젝트를 위한 플러그인
    ],
  };
});
