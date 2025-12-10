import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../Components/authContext';
import { vapi } from '../../lib/vapi.sdk';
import { configureHealthAssistant } from '../../lib/voiceConfig';
import API from '../../Components/api';
import Lottie from 'lottie-react';
import soundwaveAnimation from '../../assets/soundwaves.json';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Container,
    Alert,
    Snackbar,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Phone as PhoneIcon,
    PhoneDisabled as PhoneDisabledIcon,
    History as HistoryIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import Card from '../../Components/ui/Card';
import './voiceCompanion.css';

const CallStatus = {
    INACTIVE: 'INACTIVE',
    LOADING: 'LOADING',
    CONNECTING: 'CONNECTING',
    ACTIVE: 'ACTIVE',
    FINISHED: 'FINISHED',
};

export const VoiceCompanion = () => {
    const { email, loggedIn } = useAuth();
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
    const [messages, setMessages] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [userContext, setUserContext] = useState('');
    const [pastSessions, setPastSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [callStartTime, setCallStartTime] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const messagesRef = useRef([]);
    const transcriptEndRef = useRef(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (loggedIn && email) {
            loadUserContext();
        }
    }, [loggedIn, email]);

    useEffect(() => {
        const onCallStart = () => {
            console.log('Call started');
            setCallStatus(CallStatus.ACTIVE);
            setCallStartTime(Date.now());
            showNotification('Call connected! Start speaking...', 'success');
        };

        const onCallEnd = async () => {
            console.log('Call ended');
            setCallStatus(CallStatus.FINISHED);
            setIsAISpeaking(false);

            const duration = callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0;

            if (messagesRef.current.length > 0) {
                await saveVoiceSession(messagesRef.current, duration);
            }

            showNotification('Call ended. Transcript saved!', 'info');

            setTimeout(() => loadUserContext(), 1000);
        };

        const onMessage = (msg) => {
            console.log('Message received:', msg);

            if (msg.type === 'transcript' && msg.transcriptType === 'final') {
                const newMsg = {
                    role: msg.role,
                    content: msg.transcript,
                    timestamp: new Date().toISOString(),
                };

                setMessages((prev) => {
                    const updated = [...prev, newMsg];
                    messagesRef.current = updated;
                    return updated;
                });
            }
        };

        const onSpeechStart = () => {
            console.log('AI started speaking');
            setIsAISpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log('AI stopped speaking');
            setIsAISpeaking(false);
        };

        const onError = (error) => {
            console.error('VAPI Error:', error);
            showNotification(`Error: ${error.message || 'Something went wrong'}`, 'error');
            setCallStatus(CallStatus.INACTIVE);
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        };
    }, [callStartTime, email]);

    const loadUserContext = async () => {
        try {
            const res = await API.get('/getVoiceContext', {
                params: { email },
            });

            setUserContext(res.data.context || '');
            setPastSessions(res.data.pastSessions || []);
            console.log('User context loaded:', res.data);
        } catch (error) {
            console.error('Error loading context:', error);
        }
    };

    const saveVoiceSession = async (transcript, duration) => {
        try {
            await API.post('/saveVoiceSession', {
                email,
                transcript,
                duration,
            });
            console.log('Voice session saved successfully');
        } catch (error) {
            console.error('Error saving voice session:', error);
            showNotification('Failed to save transcript', 'error');
        }
    };

    const handleStartCall = async () => {
        if (!process.env.VAPI_TOKEN) {
            showNotification('VAPI token not configured. Please check your .env file.', 'error');
            return;
        }

        try {
            setCallStatus(CallStatus.LOADING);
            setMessages([]);
            messagesRef.current = [];

            const assistant = configureHealthAssistant(userContext);

            console.log('Starting call with assistant config:', assistant);

            await vapi.start(assistant);
            setCallStatus(CallStatus.CONNECTING);
        } catch (error) {
            console.error('Error starting call:', error);
            showNotification('Failed to start call. Check microphone permissions.', 'error');
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    const handleEndCall = () => {
        try {
            vapi.stop();
        } catch (error) {
            console.error('Error ending call:', error);
        }
    };

    const toggleMute = () => {
        const newMuteState = !isMuted;
        vapi.setMuted(newMuteState);
        setIsMuted(newMuteState);
        showNotification(newMuteState ? 'Microphone muted' : 'Microphone unmuted', 'info');
    };

    const showNotification = (message, severity = 'info') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setShowAlert(true);
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="voice-companion-container">
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="voice-header"
                >
                    <div className="header-content">
                        <h1 className="page-title">
                            <PhoneIcon className="title-icon" />
                            Voice AI Health Companion
                        </h1>
                        <p className="page-subtitle">
                            Have a natural conversation about your health and nutrition goals
                        </p>
                    </div>
                </motion.div>

                <div className="voice-layout">
                    <div className="call-section">
                        <Card variant="glass" className="call-card">
                            <div className="voice-visualizer">
                                <AnimatePresence>
                                    {callStatus === CallStatus.ACTIVE && isAISpeaking && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="soundwave-container"
                                        >
                                            <Lottie
                                                animationData={soundwaveAnimation}
                                                loop={true}
                                                className="soundwave-animation"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {callStatus === CallStatus.INACTIVE && (
                                    <div className="call-status-display">
                                        <MicIcon className="status-icon inactive" />
                                        <p className="status-text">Ready to start conversation</p>
                                    </div>
                                )}

                                {callStatus === CallStatus.LOADING && (
                                    <div className="call-status-display">
                                        <CircularProgress size={60} />
                                        <p className="status-text">Initializing AI...</p>
                                    </div>
                                )}

                                {callStatus === CallStatus.CONNECTING && (
                                    <div className="call-status-display">
                                        <CircularProgress size={60} />
                                        <p className="status-text">Connecting...</p>
                                    </div>
                                )}

                                {callStatus === CallStatus.ACTIVE && !isAISpeaking && (
                                    <div className="call-status-display">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <MicIcon className="status-icon active" />
                                        </motion.div>
                                        <p className="status-text">Listening...</p>
                                    </div>
                                )}

                                {callStatus === CallStatus.FINISHED && (
                                    <div className="call-status-display">
                                        <PhoneDisabledIcon className="status-icon finished" />
                                        <p className="status-text">Call ended</p>
                                    </div>
                                )}
                            </div>

                            {/* Call Controls */}
                            <div className="call-controls">
                                {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? (
                                    <button
                                        onClick={handleStartCall}
                                        className="btn-call btn-start"
                                        disabled={callStatus === CallStatus.LOADING}
                                    >
                                        <PhoneIcon />
                                        <span>Start Conversation</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={toggleMute}
                                            className={`btn-call btn-mute ${isMuted ? 'muted' : ''}`}
                                            disabled={callStatus !== CallStatus.ACTIVE}
                                        >
                                            {isMuted ? <MicOffIcon /> : <MicIcon />}
                                        </button>
                                        <button
                                            onClick={handleEndCall}
                                            className="btn-call btn-end"
                                        >
                                            <PhoneDisabledIcon />
                                            <span>End Call</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {messages.length > 0 && (
                                <div className="transcript-container">
                                    <h3 className="transcript-title">Live Transcript</h3>
                                    <div className="transcript-messages">
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`message ${msg.role}`}
                                            >
                                                <div className="message-content">
                                                    <span className="message-role">
                                                        {msg.role === 'user' ? 'You' : 'Dr. Sarah'}
                                                    </span>
                                                    <p>{msg.content}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={transcriptEndRef} />
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="history-section">
                        <Card variant="glass" className="history-card">
                            <div className="history-header">
                                <HistoryIcon />
                                <h3>Past Sessions</h3>
                            </div>

                            {pastSessions.length === 0 ? (
                                <div className="empty-history">
                                    <p>No past conversations yet</p>
                                    <p className="empty-hint">Start your first session!</p>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {pastSessions.map((session, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`history-item ${selectedSession === idx ? 'selected' : ''}`}
                                            onClick={() =>
                                                setSelectedSession(selectedSession === idx ? null : idx)
                                            }
                                        >
                                            <div className="history-item-header">
                                                <span className="history-date">
                                                    {formatDate(session.session_date)}
                                                </span>
                                                <Chip
                                                    label={formatDuration(session.duration_seconds)}
                                                    size="small"
                                                    className="duration-chip"
                                                />
                                            </div>
                                            <p className="history-preview">
                                                {session.transcript[0]?.content.substring(0, 60)}...
                                            </p>

                                            {selectedSession === idx && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="session-details"
                                                >
                                                    <div className="session-transcript">
                                                        {session.transcript.map((msg, msgIdx) => (
                                                            <div key={msgIdx} className={`session-message ${msg.role}`}>
                                                                <strong>{msg.role === 'user' ? 'You' : 'Dr. Sarah'}:</strong>{' '}
                                                                {msg.content}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </Container>

            <Snackbar
                open={showAlert}
                autoHideDuration={4000}
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowAlert(false)}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};
