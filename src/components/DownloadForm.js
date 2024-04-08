import axios from "axios";
import React from "react";
import { useState } from "react";


function DownloadForm() {
  const [files, setFiles] = useState({ fileLeft: null, fileRight: null });
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);
  const [resultAnnotated, setResultAnnotated] = useState(null);

      const onFileChange = (file, name) => {
        let newFiles = { ...files };
        if (name === "photoLeft") {
            newFiles.fileLeft = file;
            setFiles(newFiles);
        } else {
            newFiles.fileRight = file;
            setFiles(newFiles);
        }
        console.log(files)
    }

      const onCheckboxChange = (e) => {
        setChecked(e.target.checked);
    }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    // Update the formData object
    formData.append("image1", files.fileLeft);
    formData.append("image2", files.fileRight)
    formData.append("is_vertical_stitching", checked);




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
        setResultAnnotated(res.data.annotated_image);
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
                    {files.fileLeft &&
                        <div className="file-details">
                            <h4>Левый файл:</h4>
                            <p>
                                Имя файла:{" "}
                                {files.fileLeft.name}
                            </p>
                            <p>
                                Тип файла:{" "}
                                {files.fileLeft.type}
                            </p>
                        </div>
                    }
                    {files.fileRight &&
                        <div className="file-details">
                            <h4>Правый файл:</h4>
                            <p>
                                Имя файла:{" "}
                                {files.fileRight.name}
                            </p>
                            <p>
                                Тип файла:{" "}
                                {files.fileRight.type}
                            </p>
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>
                        Выберите файлы прежде, чем нажимать кнопку "Обработать"
                    </h4>
                </div>
            );
        }
    }


    return (
        <div className="main-content">
            <form onSubmit={handleSubmit}>
                <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                    <h3>1 фото</h3>
                    <input className="conf-step__input" type="file" placeholder="Выберите файл" name="photoLeft" accept="image/*,image/jpeg" onChange={(e) => onFileChange(e.target.files[0], e.target.name)} />
                </label>
                <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                    <h3>2 фото</h3>
                    <input className="conf-step__input" type="file" placeholder="Выберите файл" name="photoRight" accept="image/*,image/jpeg" onChange={(e) => onFileChange(e.target.files[0], e.target.name)} />
                </label>
                <label>
                    <input className="checkbox" type="checkbox" onChange={(e) => onCheckboxChange(e)} checked={checked}/>
                    Отметить, если необходима вертикальная склейка
                </label>
                <input type="submit" value="Обработать" className="download-button" />
                {fileData(files)}
            </form>


      {result &&
                <>
                    <h2>Результат</h2>
                  <div className="result-image-container">
                    <img className="result-image" src={`data:image/png;base64,${result}`}/>
                </div>
                    <h2 className="ttt">Результат обработки YOLO</h2>
                    <div className="result-image-container">
                        <img className="result-image" src={`data:image/png;base64,${resultAnnotated}`}/>
                    </div>
                </>}
        </div>
    );
}

export default DownloadForm;
