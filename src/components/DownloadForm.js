import axios from "axios";
import React from "react";
import { useState } from "react";


function DownloadForm() {

    const [files, setFiles] = useState({ fileLeft: null, fileRight: null });

    const onFileChange = (file, name) => {
        let newFiles = {...files};
        if (name === "photoLeft") {
            newFiles.fileLeft = file;
            setFiles(newFiles);
        } else {
            newFiles.fileRight = file;
            setFiles(newFiles);
        }
        console.log(files)
    }

    function handleSubmit(e) {
        e.preventDefault()
        // post('/images');
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "myFile",
            files
        );
        console.log(e, files)
        axios.post(
            "http://localhost:3000/upload",
            formData,
            {
                headers: {
                    "Content-type": "multipart/form-data"
                },
            }
        )
            .then(res => {
                console.log(`Success` + res.data);
                setFiles({ fileLeft: null, fileRight: null });
            })
            .catch(err => {
                console.log(err);
            })

        // Request made to the backend api
        // Send formData object
        axios.post("api/uploadfile", formData);
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
                        Выберите файлы прежде, чем нажимать кнопку "Загрузить"
                    </h4>
                </div>
            );
        }
    }


    return (
        <div className="main-content">
            <h2>Загрузка файлов</h2>
            {/* <input id="field-one" type="file" class="field" placeholder="Выберите файл" required=""></input> */}
            {/* <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                <input className="conf-step__input" type="file" placeholder="Выберите файл" name="photo" onChange={e => setData('poster', e.target.files[0])} multiple accept="image/*,image/jpeg"/>
            </label> */}
            <form onSubmit={handleSubmit}>
                <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                    <h3>Левая сторона</h3>
                    <input className="conf-step__input" type="file" placeholder="Выберите файл" name="photoLeft" accept="image/*,image/jpeg" onChange={(e) => onFileChange(e.target.files[0], e.target.name)} />
                </label>
                <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                    <h3>Правая сторона</h3>
                    <input className="conf-step__input" type="file" placeholder="Выберите файл" name="photoRight" accept="image/*,image/jpeg" onChange={(e) => onFileChange(e.target.files[0], e.target.name)} />
                </label>
                <input type="submit" value="Загрузить" className="download-button" />
                {fileData(files)}
            </form>
        </div>
    );
}

export default DownloadForm;
