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
        <h1>Загрузить несколько соседних фотографий и получить один панорамный снимок</h1>
        <p>Наш модуль бесшовной склейки изображений поможет вам получить из нескольких фоторафий один панорамный снимок,
           что поможет экономить время работы системы по распознаванию уникальных товаров по ряду показателей (память, время на обработку мониторинга)</p>
        {/* <p className="conf-step__paragraph">Выберите действие:</p> */}
        <ul className="conf-step__list">
          <li >
            <button className="conf-step__button" onClick={() => openModal('download')}>ЗАГРУЗКА ФАЙЛОВ</button>
          </li>
          {/* <li >
            <button className="conf-step__button" onClick={() => openModal('receiving')}>Получение файлов</button>
          </li> */}
        </ul>
        {modalIsOpen === 'download' && <DownloadForm />}
        {/* {modalIsOpen === 'receiving' && <ReceivingFile />} */}
      </div>
    </div>
  );
}

export default App;
