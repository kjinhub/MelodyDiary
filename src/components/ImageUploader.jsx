import { useState } from "react";
import "./ImageUploader.css";

function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onUpload(url);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onUpload(url);
    }
  };

  return (
    <div
      className={`upload-box ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}>
      {preview ? (
        <img src={preview} alt="미리보기" />
      ) : (
        <p>📷 사진을 드래그하거나 클릭해 업로드</p>
      )}
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}

export default ImageUploader;
