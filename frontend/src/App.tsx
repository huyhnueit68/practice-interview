import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import './assets/scss/index.scss';
import { Provider } from 'react-redux';
import commonStore from './stores/commonStore';
import PracticeMain from './pages/PracticeMain';
import Sheet from './components/sheet/Sheet';

function App() {
  return (
    <Provider store={commonStore}>
      <Routes>
        <Route path="/" element={<PracticeMain />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sheet" element={<Sheet />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
