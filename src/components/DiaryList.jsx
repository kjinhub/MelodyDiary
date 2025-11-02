import DiaryItem from "./DiaryItem";
import "./DiaryList.css";

function DiaryList({ diaries, onDelete }) {
  if (diaries.length === 0) {
    return <p className="empty">아직 작성된 일기가 없습니다.</p>;
  }

  return (
    <div className="diary-list">
      {diaries.map((d) => (
        <DiaryItem key={d.id} diary={d} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default DiaryList;
