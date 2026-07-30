import { Routes, Route } from 'react-router-dom';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersListPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
    </Routes>
  );
}

export default App;
