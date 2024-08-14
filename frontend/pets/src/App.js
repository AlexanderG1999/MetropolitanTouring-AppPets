import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShowPets from './components/ShowPets';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowPets />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
