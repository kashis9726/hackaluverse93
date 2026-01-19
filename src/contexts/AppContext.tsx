import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Startup, ReversePitch, Event, Question, ChatRoom, User, Answer } from '../types';

interface AppContextType {
  posts: Post[];
  startups: Startup[];
  reversePitches: ReversePitch[];
  events: Event[];
  questions: Question[];
  chatRooms: ChatRoom[];
  users: User[];
  internships: any[]; // User proper type Internship[]
  challenges: any[]; // Use proper type Challenge[]
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  addStartup: (startup: Omit<Startup, 'id' | 'createdAt'>) => void;
  addReversePitch: (pitch: Omit<ReversePitch, 'id' | 'createdAt'>) => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'createdAt'>) => void;
  likePost: (postId: string, userId: string) => void;
  likeStartup: (startupId: string, userId: string) => void;
  joinEvent: (eventId: string, userId: string) => void;
  getChatRoom: (participantIds: string[]) => ChatRoom;
  sendMessage: (roomId: string, message: any) => void;
  updateUserPoints: (userId: string, points: number) => void;
  submitReverseSolution: (pitchId: string, payload: { studentId: string; content: string }) => void;
  acceptReverseSolution: (pitchId: string, submissionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [reversePitches, setReversePitches] = useState<ReversePitch[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [internships, setInternships] = useState<any[]>([]); // Using any temporarily or defined type if imported
  const [challenges, setChallenges] = useState<any[]>([]);

  const API_BASE = '/api';
  const REQUEST_TIMEOUT_MS = 10000;

  const fetchWithTimeout = async (url: string, init?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    if (init?.signal) {
      init.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init?.headers ? (init.headers as any) : {}),
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      return await fetch(url, { ...init, headers, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // Fetch ALL REAL data from MongoDB backend - NO demo data whatsoever
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching REAL database data from MongoDB...');

        // Fetch blogs
        const blogsRes = await fetchWithTimeout(`${API_BASE}/blogs`);
        if (blogsRes?.ok) {
          const blogs = await blogsRes.json();
          setPosts(blogs as Post[]);
          console.log('✅ Blogs:', blogs.length);
        }

        // Fetch users (requires auth, so may fail if not logged in)
        try {
          const usersRes = await fetchWithTimeout(`${API_BASE}/users`);
          if (usersRes?.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData as User[]);
            console.log('✅ Users:', usersData.length);
          } else if (usersRes?.status === 401) {
            console.log('ℹ️ Users endpoint requires authentication - skipping');
          }
        } catch (err) {
          console.log('ℹ️ Could not fetch users (may require auth)');
        }

        // Fetch events
        const eventsRes = await fetchWithTimeout(`${API_BASE}/events`);
        if (eventsRes?.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData as Event[]);
          console.log('✅ Events:', eventsData.length);
        }

        // Fetch questions
        const questionsRes = await fetchWithTimeout(`${API_BASE}/qa`);
        if (questionsRes?.ok) {
          const questionsData = await questionsRes.json();
          setQuestions(questionsData as Question[]);
          console.log('✅ Questions:', questionsData.length);
        }

        // Fetch startups
        const startupsRes = await fetchWithTimeout(`${API_BASE}/startups`);
        if (startupsRes?.ok) {
          const startupsData = await startupsRes.json();
          setStartups(startupsData as Startup[]);
          console.log('✅ Startups:', startupsData.length);
        }

        // Fetch Internships (Opportunities)
        const internshipsRes = await fetchWithTimeout(`${API_BASE}/internships`);
        if (internshipsRes?.ok) {
          const internData = await internshipsRes.json();
          setInternships(internData);
          console.log('✅ Internships:', internData.length);
        }

        // Fetch Challenges (Coding)
        const challengesRes = await fetchWithTimeout(`${API_BASE}/challenges`).catch(() => null);
        if (challengesRes?.ok) {
          const challengeData = await challengesRes.json();
          setChallenges(challengeData);
          console.log('✅ Challenges:', challengeData.length);
        }

        // Fetch Reverse Pitches (Industry Problems)
        const reverseRes = await fetchWithTimeout(`${API_BASE}/reverse-pitch`).catch(() => null);
        if (reverseRes?.ok) {
          const reverseData = await reverseRes.json();
          setReversePitches(reverseData);
          console.log('✅ Reverse Pitches:', reverseData.length);
        }

        console.log('✅ All real MongoDB data loaded!');
      } catch (error) {
        console.error('❌ Error fetching from backend:', error);
      }
    };

    fetchData();
  }, []);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPosts([newPost, ...posts]);
  };

  const addStartup = (startupData: Omit<Startup, 'id' | 'createdAt'>) => {
    const newStartup: Startup = {
      ...startupData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setStartups([newStartup, ...startups]);
  };

  const addReversePitch = (pitchData: Omit<ReversePitch, 'id' | 'createdAt'>) => {
    const newPitch: ReversePitch = {
      ...pitchData,
      id: Date.now().toString(),
      createdAt: new Date(),
    } as ReversePitch;
    setReversePitches([newPitch, ...reversePitches]);
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setEvents([newEvent, ...events]);
  };

  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setQuestions([newQuestion, ...questions]);
  };

  const addAnswer = (questionId: string, answerData: Omit<Answer, 'id' | 'createdAt'>) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const newAnswer: Answer = {
          ...answerData,
          id: Date.now().toString(),
          createdAt: new Date(),
        } as Answer;
        return { ...q, answers: [...q.answers, newAnswer] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const likePost = (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const likeStartup = (startupId: string, userId: string) => {
    const updatedStartups = startups.map(startup => {
      if (startup.id === startupId) {
        const likes = startup.likes.includes(userId)
          ? startup.likes.filter(id => id !== userId)
          : [...startup.likes, userId];
        return { ...startup, likes };
      }
      return startup;
    });
    setStartups(updatedStartups);
  };

  const joinEvent = (eventId: string, userId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const attendees = event.attendees.includes(userId)
          ? event.attendees.filter(id => id !== userId)
          : [...event.attendees, userId];
        return { ...event, attendees };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const getChatRoom = (participantIds: string[]): ChatRoom => {
    const sortedIds = participantIds.sort();
    let room = chatRooms.find(room =>
      room.participants.length === sortedIds.length &&
      room.participants.every(id => sortedIds.includes(id))
    );

    if (!room) {
      room = {
        id: Date.now().toString(),
        participants: sortedIds,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setChatRooms([...chatRooms, room]);
    }

    return room;
  };

  const sendMessage = (roomId: string, messageData: any) => {
    const newRooms = chatRooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          messages: [...r.messages, { ...messageData, id: Date.now().toString(), timestamp: new Date() }],
          updatedAt: new Date()
        };
      }
      return r;
    });
    setChatRooms(newRooms);
  };

  const updateUserPoints = (userId: string, points: number) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, points: user.points + points } : user
    );
    setUsers(updatedUsers);
  };

  const submitReverseSolution = (pitchId: string, payload: { studentId: string; content: string }) => {
    const student = users.find(u => u.id === payload.studentId);
    const updated = reversePitches.map(rp => {
      if (rp.id !== pitchId) return rp;
      const submission: any = {
        id: Date.now().toString(),
        studentId: payload.studentId,
        student,
        content: payload.content,
        createdAt: new Date(),
        status: 'pending'
      };
      return { ...(rp as any), submissions: [...(rp.submissions || []), submission] } as ReversePitch;
    });
    setReversePitches(updated);
    updateUserPoints(payload.studentId, 25);
  };

  const acceptReverseSolution = (pitchId: string, submissionId: string) => {
    const rp = reversePitches.find(r => r.id === pitchId);
    if (!rp) return;
    const updated = reversePitches.map(r => {
      if (r.id !== pitchId) return r;
      const subs = (r.submissions || []).map((s: any) => s.id === submissionId ? { ...s, status: 'accepted' } : s);
      return { ...(r as any), submissions: subs } as ReversePitch;
    });
    setReversePitches(updated);
    if (rp.authorId) updateUserPoints(rp.authorId, 10);
  };

  return (
    <AppContext.Provider value={{
      posts,
      startups,
      reversePitches,
      events,
      questions,
      chatRooms,
      users,
      internships, // EXPOSED
      challenges,  // EXPOSED
      addPost,
      addStartup,
      addReversePitch,
      submitReverseSolution,
      acceptReverseSolution,
      addEvent,
      addQuestion,
      addAnswer,
      likePost,
      likeStartup,
      joinEvent,
      getChatRoom,
      sendMessage,
      updateUserPoints
    }}>
      {children}
    </AppContext.Provider>
  );
};
