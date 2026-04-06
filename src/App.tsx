import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePlanStore } from './stores/planStore';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { DayDetail } from './pages/DayDetail';
import { Workout } from './pages/Workout';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

function App() {
  const { setupComplete } = usePlanStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/" element={setupComplete ? <Home /> : <Navigate to="/setup" />} />
        <Route path="/day/:dayId" element={setupComplete ? <DayDetail /> : <Navigate to="/setup" />} />
        <Route path="/workout/:dayId/:week" element={setupComplete ? <Workout /> : <Navigate to="/setup" />} />
        <Route path="/history" element={setupComplete ? <History /> : <Navigate to="/setup" />} />
        <Route path="/settings" element={setupComplete ? <Settings /> : <Navigate to="/setup" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
