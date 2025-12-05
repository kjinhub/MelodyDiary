/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import useDiaries from "../hooks/useDiaries";
import useFavorites from "../hooks/useFavorites";

// 전역 상태 관리를 위한 Context 생성
const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  // 일기 관련 상태 및 함수 (CRUD 등)
  const diariesState = useDiaries();

  // 즐겨찾기(찜) 관련 상태 및 함수
  const favoritesState = useFavorites();

  // 두 훅의 상태를 병합하여 전역 공급
  return (
    <DiaryContext.Provider value={{ ...diariesState, ...favoritesState }}>
      {children}
    </DiaryContext.Provider>
  );
};

// Context를 간편하게 사용할 수 있는 custom hook
export const useDiaryContext = () => useContext(DiaryContext);
