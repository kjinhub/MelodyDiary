/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import useDiaries from "../hooks/useDiaries";
import useFavorites from "../hooks/useFavorites";

const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const diariesState = useDiaries();
  const favoritesState = useFavorites();

  return (
    <DiaryContext.Provider value={{ ...diariesState, ...favoritesState }}>
      {children}
    </DiaryContext.Provider>
  );
};

// ✅ 어디서든 쉽게 쓸 수 있도록 custom hook 제공
export const useDiaryContext = () => useContext(DiaryContext);
