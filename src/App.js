import { BrowserRouter,  Route, Routes } from 'react-router-dom';
import Home from './view/Home';


function App() {
  return (
    <div className="App">
     
     <BrowserRouter>
            <Routes>
            <Route path="/" exact element={<Home/>} />
          
              </Routes>
              </BrowserRouter>
    </div>
  );
}

export default App;
