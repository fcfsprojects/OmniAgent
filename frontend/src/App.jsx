import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AgentCreate from './pages/AgentCreate';
import AgentDetail from './pages/AgentDetail';
import Chat from './pages/Chat';
import Providers from './pages/Providers';
import QuickChat from './pages/QuickChat';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents/new" element={<AgentCreate />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/chat/:agentId" element={<Chat />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/quick-chat" element={<QuickChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
