import DownloadForm from './components/DownloadForm'
import './App.css';

function App() {
 
  return (
    <div className="container">
      <div className="background-element">
      </div>
      <div className="highlight-window">
        <div className='highlight-overlay'></div>
      </div>
      <div className="window">
        <DownloadForm/>
      </div>
    </div>
  );
}

export default App;
