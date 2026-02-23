import logo from './logo.svg';
import './App.css';

import { useEffect } from 'react';
import VimEditor from './editor/vimEditor.js';

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/") //Django backend url
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
	<VimEditor />
      </header>
    </div>
  );
}

export default App;
