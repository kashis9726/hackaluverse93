// ...existing code...
// ...existing code...
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import AppRouter from './components/AppRouter';
import VideoCall from './components/chat/VideoCall';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppProvider>
          <AppRouter />
          <VideoCall />
        </AppProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;