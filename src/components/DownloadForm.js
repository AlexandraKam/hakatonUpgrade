import axios from "axios";
import React from "react";
import { useState } from "react";


function DownloadForm() {
  const [files, setFiles] = useState({ fileLeft: null, fileRight: null });
  const [result, setResult] = useState(null);

  const onFileChange = (file, name) => {
    let newFiles = { ...files };
    if (name === "photoLeft") {
      newFiles.fileLeft = file;
    } else {
      newFiles.fileRight = file;
    }
    setFiles(newFiles);
    console.log(files);
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    // Update the formData object
    formData.append("image1", files.fileLeft);
    formData.append("image2", files.fileRight);

    console.log(e, files);
    axios
      .post("http://localhost:5000/api/process-images", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(`Success`, res);
        setFiles({ fileLeft: null, fileRight: null });
        setResult(res.data.stitched_image);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fileData = (files) => {
    if (files.fileLeft || files.fileRight) {
      return (
        <div>
          <h2>Детали:</h2>
          {files.fileLeft && (
            <div className="file-details">
              <h4>Левый файл:</h4>
              <p>Имя файла: {files.fileLeft.name}</p>
              <p>Тип файла: {files.fileLeft.type}</p>
            </div>
          )}
          {files.fileRight && (
            <div className="file-details">
              <h4>Правый файл:</h4>
              <p>Имя файла: {files.fileRight.name}</p>
              <p>Тип файла: {files.fileRight.type}</p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Выберите файлы прежде, чем нажимать кнопку "Загрузить"</h4>
        </div>
      );
    }
  };

  return (
    <div className="main-content">
      <h2>Загрузка файлов</h2>
      <form onSubmit={handleSubmit}>
        <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
          <h3>Левая сторона</h3>
          <input
            className="conf-step__input"
            type="file"
            placeholder="Выберите файл"
            name="photoLeft"
            accept="image/*,image/jpeg"
            onChange={(e) => onFileChange(e.target.files[0], e.target.name)}
          />
        </label>
        <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
          <h3>Правая сторона</h3>
          <input
            className="conf-step__input"
            type="file"
            placeholder="Выберите файл"
            name="photoRight"
            accept="image/*,image/jpeg"
            onChange={(e) => onFileChange(e.target.files[0], e.target.name)}
          />
        </label>
        <input type="submit" value="Загрузить" className="download-button" />
        {fileData(files)}
      </form>

      {result &&
                <>
                    <h2>Результат</h2>
                  <div className="result-image-container">
                    <img className="result-image" src={`data:image/png;base64,${result}`} />
    </div>


                </>}
        </div>
    );
}

export default DownloadForm;
