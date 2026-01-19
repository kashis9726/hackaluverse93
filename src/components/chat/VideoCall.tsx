import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const VideoCall: React.FC = () => {
    const {
        socket,
        callState,
        incomingCall,
        activeCall,
        answerCall,
        rejectCall,
        endCall
    } = useSocket();
    const { user } = useAuth();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer.Instance | null>(null);

    // 1. Handle RINGING/INCOMING
    if (callState === 'RINGING' && incomingCall) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-bounce-slight">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-10 w-10 text-blue-600 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Incoming {incomingCall.type} Call</h2>
                    <p className="text-gray-500 mb-8">Someone is calling you...</p>

                    <div className="flex gap-6 justify-center">
                        <button
                            onClick={() => rejectCall(incomingCall.callId)}
                            className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <PhoneOff className="h-8 w-8 text-white" />
                        </button>
                        <button
                            onClick={() => answerCall(incomingCall.callId)}
                            className="p-4 bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                        >
                            <Phone className="h-8 w-8 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Handle ACTIVE Call (WebRTC)
    useEffect(() => {
        if (callState === 'ACTIVE' && activeCall) {
            // Get Media
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    if (myVideo.current) myVideo.current.srcObject = currentStream;

                    console.log("INITIALIZING PEER. Am I caller?", activeCall.callerId === user?.id);
                    const isInitiator = activeCall.callerId === user?.id;

                    const peer = new Peer({
                        initiator: isInitiator,
                        trickle: false,
                        stream: currentStream
                    });

                    peer.on('signal', (data) => {
                        socket?.emit('signal', {
                            targetId: isInitiator ? activeCall.receiverId : activeCall.callerId, // Simplified for brevity
                            signalData: data,
                            callId: activeCall.callId
                        });
                    });

                    peer.on('stream', (remote) => {
                        setRemoteStream(remote);
                        if (userVideo.current) userVideo.current.srcObject = remote;
                    });

                    socket?.on('signal', (data) => {
                        peer.signal(data.signalData);
                    });

                    peerRef.current = peer;
                });
        } else {
            // Cleanup
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (peerRef.current) peerRef.current.destroy();
            setStream(null);
            setRemoteStream(null);
        }
        // eslint-disable-next-line
    }, [callState]);

    if (callState === 'ACTIVE' || callState === 'OUTGOING') {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
                <div className="flex-1 relative">
                    {/* Remote Video (Full Screen) */}
                    <video
                        playsInline
                        ref={userVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                    />

                    {/* Local Video (PiP) */}
                    <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                        <video
                            playsInline
                            muted
                            ref={myVideo}
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Connecting Overlay */}
                    {callState === 'OUTGOING' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="text-white text-xl font-medium animate-pulse">Calling...</div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-8 bg-black/80 backdrop-blur-md flex justify-center gap-6">
                    <button
                        onClick={() => { setMicOn(!micOn); stream?.getAudioTracks().forEach(t => t.enabled = !micOn); }}
                        className={`p-4 rounded-full ${micOn ? 'bg-gray-700' : 'bg-red-500'} text-white transition-colors`}
                    >
                        {micOn ? <Mic /> : <MicOff />}
                    </button>

                    <button
                        onClick={() => { setVideoOn(!videoOn); stream?.getVideoTracks().forEach(t => t.enabled = !videoOn); }}
                        className={`p-4 rounded-full ${videoOn ? 'bg-gray-700' : 'bg-red-500'} text-white transition-colors`}
                    >
                        {videoOn ? <Video /> : <VideoOff />}
                    </button>

                    <button
                        onClick={() => activeCall && endCall(activeCall.callId)}
                        className="p-4 bg-red-600 rounded-full hover:bg-red-700 text-white shadow-lg px-8 flex items-center"
                    >
                        <PhoneOff className="mr-2" /> End
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default VideoCall;
