import { useState, useEffect } from "react";
import DiaryEditor from "./components/DiaryEditor";
import DiaryList from "./components/DiaryList";
import "./App.css";

function App() {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("diaries");
    if (saved) setDiaries(JSON.parse(saved));
  }, []);

  const addDiary = (newDiary) => {
    const updated = [newDiary, ...diaries];
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  const deleteDiary = (id) => {
    const updated = diaries.filter((d) => d.id !== id);
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🎵 Melody Diary</h1>
      <DiaryEditor onAdd={addDiary} />
      <DiaryList diaries={diaries} onDelete={deleteDiary} />
    </div>
  );
}

export default App;
