import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useApp } from '../../contexts/AppContext'; // Still needed for users list
import { X, Send, Search, Check, CheckCheck, Video } from 'lucide-react';

interface ChatProps {
  onClose: () => void;
}

interface Message {
  _id: string; // MongoDB ID
  uniqueId?: string; // Optimistic ID
  senderId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  type: string;
}

const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { users } = useApp();
  const { socket, sendMessage, onlineFriends, initCall } = useSocket();

  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch History
  useEffect(() => {
    if (!activeChatUser || !user) return;

    setMessages([]); // Clear previous

    const fetchHistory = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('auth_token') || '{}');
        const res = await fetch(`/api/chat/history/${activeChatUser}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, [activeChatUser, user]);

  // Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: any) => {
      // Only append if it belongs to current chat
      if (activeChatUser === msg.senderId || (msg.senderId === user?.id && activeChatUser === msg.receiverId)) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // Immediately ACK delivery (Persistence simulation)
        if (msg.senderId !== user?.id) {
          socket.emit('message_delivered', { messageIds: [msg._id] });
          // If chat is open, Mark Read
          socket.emit('mark_read', { conversationId: msg.conversationId, senderId: msg.senderId });
        }
      }
    };
    // ... (rest same)

    const handleStatusUpdate = (payload: any) => {
      const { status, messageIds, conversationId } = payload;

      setMessages(prev => prev.map(m => {
        if (messageIds && messageIds.includes(m._id)) return { ...m, status };
        if (status === 'read' && m.status !== 'read') return { ...m, status: 'read' }; // Simplification for MVP
        return m;
      }));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_status_update', handleStatusUpdate);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_status_update', handleStatusUpdate);
    };
  }, [socket, activeChatUser]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeChatUser || !user) return;

    const tempId = Date.now().toString();
    const tempMsg: Message = {
      _id: tempId,
      uniqueId: tempId,
      senderId: user.id,
      content: inputText,
      status: 'sent', // Optimistic: Single Grey Tick logic (Server ack will confirm)
      createdAt: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, tempMsg]);
    setInputText('');

    try {
      const serverMsg = await sendMessage({
        receiverId: activeChatUser,
        content: tempMsg.content,
        uniqueId: tempId,
        type: 'text'
        // conversationId logic handled by backend for MVP or derived here
      });

      // Update with real ID from server
      setMessages(prev => prev.map(m => m.uniqueId === tempId ? { ...serverMsg } : m));
    } catch (err) {
      console.error('Send failed', err);
      // Show error state
    }
  };

  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  // Fetch connected users
  useEffect(() => {
    if (!user) return;
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch('/api/connections', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConnectedIds(new Set(data.connectedIds));
        }
      } catch (e) { console.error(e); }
    };
    fetchConnections();
  }, [user]);

  const filteredUsers = users.filter(u =>
    u.id !== user?.id &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    // Show if: Connected OR (I am Admin) OR (Target is Admin - optional, keeping gated for now)
    (connectedIds.has(u.id) || user?.role === 'admin')
  );

  const activeUserObj = activeChatUser ? users.find(u => u.id === activeChatUser) : null;
  const isOnline = activeUserObj ? onlineFriends.has(activeUserObj.id) : false;

  const renderTicks = (msg: Message) => {
    if (msg.senderId !== user?.id) return null;

    if (msg.status === 'read') return <CheckCheck className="h-3 w-3 text-blue-500" />;
    if (msg.status === 'delivered') return <CheckCheck className="h-3 w-3 text-gray-400" />;
    return <Check className="h-3 w-3 text-gray-400" />;
  };

  if (!activeChatUser) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.map(u => (
            <button key={u.id} onClick={() => setActiveChatUser(u.id)} className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 rounded-lg">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">{u.name[0]}</div>
                {onlineFriends.has(u.id) && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-500">{u.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveChatUser(null)} className="p-1 hover:bg-gray-100 rounded">←</button>
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">{activeUserObj?.name[0]}</div>
            {isOnline && <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{activeUserObj?.name}</h3>
            <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => activeChatUser && initCall(activeChatUser, 'video')}
            className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
            title="Start Video Call"
          >
            <Video className="h-5 w-5" />
          </button>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50" ref={messagesContainerRef}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${isMe ? 'bg-blue-600 text-white' : 'bg-white border text-gray-900'}`}>
                <p className="text-sm">{msg.content}</p>
                <div className={`flex items-center justify-end mt-1 space-x-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {renderTicks(msg)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex space-x-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={!inputText.trim()} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;