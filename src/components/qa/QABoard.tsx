import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Search, Tag, Clock, X } from 'lucide-react';
import { Question } from '../../types';

const QABoard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'answers' | 'upvotes'>('latest');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });

  // State for backend data
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/qa');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const wantsCompose = sp.get('compose') === '1';
    if (!wantsCompose || !user) return;

    try {
      const raw = sessionStorage.getItem('draftQuestion');
      if (raw) {
        const parsed = JSON.parse(raw) as { title?: string; content?: string; tags?: string };
        setNewQuestion({
          title: parsed.title || '',
          content: parsed.content || '',
          tags: parsed.tags || ''
        });
        sessionStorage.removeItem('draftQuestion');
      }
    } catch { }

    setShowCreateQuestion(true);
  }, [location.search, user]);

  const handleCreateQuestion = async () => {
    if (!user || !newQuestion.title.trim() || !newQuestion.content.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: newQuestion.title,
          content: newQuestion.content,
          tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create question');
      }

      const createdQuestion = await res.json();
      setQuestions(prev => [createdQuestion, ...prev]);

      setNewQuestion({
        title: '',
        content: '',
        tags: ''
      });
      setShowCreateQuestion(false);
    } catch (err) {
      console.error('Error creating question:', err);
      alert(err instanceof Error ? err.message : 'Failed to create question');
    }
  };

  const tagMatch = (qTags: string[]) =>
    selectedTags.length === 0 || selectedTags.every(t => qTags.map(x => x.toLowerCase()).includes(t.toLowerCase()));

  const filteredQuestions = questions
    .filter(question =>
      (question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      tagMatch(question.tags)
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'answers') {
        return b.answers.length - a.answers.length;
      }
      // upvotes
      const upA = a.answers.reduce((s, ans) => s + ans.upvotes.length, 0);
      const upB = b.answers.reduce((s, ans) => s + ans.upvotes.length, 0);
      return upB - upA;
    });

  const popularTags = [...new Set(questions.flatMap(q => q.tags))]
    .slice(0, 8);

  return (
    <div className="space-y-4 w-full">
      {/* Hero / Title */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-emerald-100/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Q&A Community</h1>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateQuestion(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white shadow-sm hover:opacity-95 transition bg-gradient-to-r from-emerald-500 to-emerald-600 whitespace-nowrap"
            >
              Ask
            </button>
          )}
        </div>

        {/* Category Bar */}
        <div className="mt-2 flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {['All', 'Career', 'Technical', 'Academic', 'Life'].map(cat => {
            const active = selectedTags.includes(cat.toLowerCase());
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'All') { setSelectedTags([]); return; }
                  setSelectedTags(prev => active ? prev.filter(t => t !== cat.toLowerCase()) : [...prev, cat.toLowerCase()]);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-none transition whitespace-nowrap ${cat === 'Technical' ? 'bg-emerald-100 text-emerald-700' :
                  cat === 'Career' ? 'bg-pink-100 text-pink-700' :
                    cat === 'Academic' ? 'bg-amber-100 text-amber-700' :
                      cat === 'Life' ? 'bg-violet-100 text-violet-700' :
                        'bg-gray-100 text-gray-700'
                  } ${active ? 'ring-1.5 ring-offset-0 ring-current' : 'opacity-75'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Sort - Compact */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-emerald-100/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent whitespace-nowrap"
          >
            <option value="latest">Latest</option>
            <option value="answers">Most Answers</option>
            <option value="upvotes">Trending</option>
          </select>
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {popularTags.map((tag, index) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      active ? prev.filter(t => t !== tag) : [...prev, tag]
                    )
                  }
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${active ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 hover:bg-red-100"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Question Modal */}
      {showCreateQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateQuestion(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-elev-2 border border-gray-200 p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Ask a Question</h2>
                <p className="mt-1 text-sm text-gray-600">Write clearly — you’ll get better answers.</p>
              </div>
              <button aria-label="Close" onClick={() => setShowCreateQuestion(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  placeholder="e.g., How do I prepare for a product-based company interview?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Details</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  placeholder="Provide context, what you tried, and what outcome you want..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  placeholder="career, internship, resume"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  onClick={() => setShowCreateQuestion(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateQuestion}
                  disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                  className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:opacity-95 disabled:opacity-50"
                >
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Answers Modal */}
      {activeQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-elev-2 border border-gray-200 p-6 max-h-[85vh] overflow-auto">
            {(() => {
              const q = questions.find(q => q.id === activeQuestionId);
              if (!q) return null;
              return (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{q.title}</h3>
                      <div className="text-sm text-gray-600">Asked by {q.author?.name || 'Unknown'} • {new Date(q.createdAt).toLocaleString()}</div>
                    </div>
                    <button aria-label="Close" onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} className="p-2 rounded-lg hover:bg-gray-100">
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-gray-800 mb-4 whitespace-pre-line">{q.content}</p>

                  {q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Answers ({q.answers.length})</h4>
                  <div className="space-y-3">
                    {q.answers.length === 0 && (
                      <div className="p-3 rounded-lg border border-gray-200 text-sm text-gray-600">No answers yet. {user?.role === 'alumni' ? 'Be the first to help.' : ''}</div>
                    )}
                    {q.answers.map((ans, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">By {ans.author?.name || 'Unknown'} • {new Date(ans.createdAt).toLocaleString()}</div>
                        <div className="text-gray-800 whitespace-pre-line">{ans.content}</div>
                      </div>
                    ))}
                  </div>

                  {(user?.role === 'alumni' || user?.role === 'admin') && (
                    <div className="mt-5">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Write your answer</h5>
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        rows={4}
                        placeholder="Share your expertise and actionable guidance..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} className="px-4 py-2 rounded-lg border">Close</button>
                        <button
                          onClick={async () => {
                            if (!user || !newAnswer.trim() || !activeQuestionId) return;

                            try {
                              const token = localStorage.getItem('authToken');
                              const res = await fetch(`/api/qa/${activeQuestionId}/answers`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                                },
                                body: JSON.stringify({ content: newAnswer.trim() })
                              });

                              if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data.message || 'Failed to add answer');
                              }

                              const createdAnswer = await res.json();

                              // Update local state
                              setQuestions(prev => prev.map(q =>
                                q.id === activeQuestionId
                                  ? { ...q, answers: [...q.answers, createdAnswer] }
                                  : q
                              ));

                              setNewAnswer('');
                            } catch (err) {
                              console.error('Error adding answer:', err);
                              alert(err instanceof Error ? err.message : 'Failed to add answer');
                            }
                          }}
                          disabled={!newAnswer.trim()}
                          className="px-4 py-2 rounded-lg text-white bg-btn-gradient disabled:opacity-50"
                        >
                          Publish Answer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50 hover:shadow-elev-2 transition">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {(question.author?.name || 'U').charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-2">{question.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Asked by {question.author?.name || 'Unknown'}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">{question.answers.length} Answers</span>
                    <button
                      onClick={() => setActiveQuestionId(question.id)}
                      className="px-4 py-1.5 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                    >
                      View Answers
                    </button>
                    {(user?.role === 'alumni' || user?.role === 'admin') && (
                      <button
                        onClick={() => setActiveQuestionId(question.id)}
                        className="px-4 py-1.5 rounded-full text-white shadow-elev-1 hover:opacity-95 active:scale-[0.98] transition bg-btn-gradient"
                      >
                        Answer
                      </button>
                    )}
                  </div>
                </div>

                {question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No questions found' : 'No questions yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search terms or browse popular topics.'
              : user
                ? 'Be the first to ask a question and start building our knowledge base!'
                : 'Sign in to ask or answer questions.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default QABoard;