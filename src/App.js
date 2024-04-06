import DownloadForm from './components/DownloadForm'
import ReceivingFile from './components/ReceivingFile';
import './App.css';
import { useState } from 'react';

function App() {

  const [modalIsOpen, setModalIsOpen] = useState();

  const openModal = (e) => {
    if (e === 'download') {
      setModalIsOpen('download')
    } else if (e === 'receiving') {
      setModalIsOpen('receiving')
    }
  };

  return (
    <div className="container">
      <div className="background-element">
      </div>
      <div className="highlight-window">
        <div className='highlight-overlay'></div>
      </div>
      <div className="window">
        <h1>Модуль бесшовной склейки изображений для подсчета уникальных товаров</h1>
        <p className="conf-step__paragraph">Выберите действие:</p>
        <ul className="conf-step__list">
          <li >
            <button className="conf-step__button" onClick={() => openModal('download')}>Загрузка файлов</button>
          </li>
          <li >
            <button className="conf-step__button" onClick={() => openModal('receiving')}>Получение файлов</button>
          </li>
        </ul>
        {modalIsOpen === 'download' && <DownloadForm />}
        {modalIsOpen === 'receiving' && <ReceivingFile />}
      </div>
    </div>
  );
}

export default App;
