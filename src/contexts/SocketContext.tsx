import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface CallData {
    callId: string;
    callerId: string;
    type: 'audio' | 'video';
    signal?: any;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineFriends: Set<string>;
    sendMessage: (payload: any) => Promise<any>;
    sendTyping: (receiverId: string) => void;
    initCall: (receiverId: string, type: 'audio' | 'video') => Promise<string>;

    // Call State
    callState: 'IDLE' | 'RINGING' | 'ACTIVE' | 'ENDED' | 'OUTGOING';
    incomingCall: CallData | null;
    activeCall: CallData | null;

    // Call Actions
    answerCall: (callId: string) => void;
    rejectCall: (callId: string) => void;
    endCall: (callId: string) => void;

    messages: any[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineFriends, setOnlineFriends] = useState<Set<string>>(new Set());

    // Call State
    const [callState, setCallState] = useState<'IDLE' | 'RINGING' | 'ACTIVE' | 'ENDED' | 'OUTGOING'>('IDLE');
    const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
    const [activeCall, setActiveCall] = useState<CallData | null>(null);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token || !user) return;

        // init socket
        const s = io('http://localhost:4000', {
            query: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        s.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        s.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
            setOnlineFriends(new Set());
            setCallState('IDLE');
        });

        // PRESENCE
        s.on('user_online', ({ userId }: { userId: string }) => {
            setOnlineFriends(prev => new Set(prev).add(userId));
        });

        s.on('user_offline', ({ userId }: { userId: string }) => {
            setOnlineFriends(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        // CALLING
        s.on('call_incoming', (data: CallData) => {
            console.log('Income Call', data);
            setIncomingCall(data);
            setCallState('RINGING');
        });

        s.on('call_accepted', (data: { callId: string, responderId: string }) => {
            console.log('Call Accepted');
            setCallState('ACTIVE');
        });

        s.on('call_ended', () => {
            console.log('Call Ended');
            setCallState('ENDED');
            setIncomingCall(null);
            setActiveCall(null);
            setTimeout(() => setCallState('IDLE'), 1000);
        });

        socketRef.current = s;
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [token, user]);

    const sendMessage = (payload: any) => {
        return new Promise((resolve, reject) => {
            if (!socketRef.current) return reject('No socket');
            socketRef.current.emit('send_message', payload, (response: any) => {
                if (response.status === 'OK') resolve(response.data);
                else reject(response.message);
            });
        });
    };

    const sendTyping = (receiverId: string) => {
        socketRef.current?.emit('typing', { receiverId });
    };

    const initCall = (receiverId: string, type: 'audio' | 'video'): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!socketRef.current) return reject('No socket');
            setCallState('OUTGOING');
            socketRef.current.emit('call_init', { receiverId, type }, (res: any) => {
                if (res.status === 'OK') {
                    setActiveCall({ callId: res.callId, callerId: user?.id || '', type });
                    resolve(res.callId);
                } else {
                    setCallState('IDLE');
                    reject(res.message);
                }
            });
        });
    };

    const answerCall = (callId: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit('answer_call', { callId });
        setCallState('ACTIVE');
        if (incomingCall) setActiveCall(incomingCall);
        setIncomingCall(null);
    };

    const rejectCall = (callId: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit('end_call', { callId, reason: 'rejected' });
        setCallState('IDLE');
        setIncomingCall(null);
    };

    const endCall = (callId: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit('end_call', { callId, reason: 'ended' });
        setCallState('ENDED');
        setActiveCall(null);
        setTimeout(() => setCallState('IDLE'), 500);
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            onlineFriends,
            sendMessage,
            sendTyping,
            initCall,

            callState,
            incomingCall,
            activeCall,

            answerCall,
            rejectCall,
            endCall,

            messages: []
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
