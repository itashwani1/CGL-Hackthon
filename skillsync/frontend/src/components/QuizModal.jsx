import { useState, useEffect } from 'react';
import { goalAPI } from '../api/api';
import GlassCard from './GlassCard';

export default function QuizModal({ taskId, isOpen, onClose, onSuccess }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 0 } (questionIndex: optionIndex)
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && taskId) {
            loadQuiz();
        }
    }, [isOpen, taskId]);

    const loadQuiz = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setAnswers({});
        try {
            const res = await goalAPI.startQuiz(taskId);
            if (res.data.success) {
                if (res.data.alreadyCompleted) {
                    setError('Task already completed!');
                } else {
                    setQuestions(res.data.questions);
                }
            }
        } catch (err) {
            setError('Failed to load quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIndex, oIndex) => {
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert('Please answer all questions!');
            return;
        }

        setSubmitting(true);
        try {
            // Convert answers object to array based on index
            const answersArray = questions.map((_, i) => answers[i]);
            const res = await goalAPI.submitQuiz(taskId, answersArray);
            if (res.data.success) {
                setResult(res.data);
                if (res.data.passed) {
                    setTimeout(() => {
                        onSuccess(res.data); // Notify parent to refresh
                    }, 2000);
                }
            }
        } catch (err) {
            setError('Failed to submit quiz.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 gradient-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Skill Assessment
                </h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Generating questions...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={onClose} className="btn-secondary">Close</button>
                    </div>
                ) : result ? (
                    <div className="text-center py-8 space-y-6">
                        <div className="text-6xl mb-4">
                            {result.passed ? '🎉' : '❌'}
                        </div>
                        <h3 className={`text-3xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
                        </h3>
                        <p className="text-white/60">
                            You scored <span className="font-bold text-white">{result.score}%</span>
                            <span className="block text-sm mt-1 text-gray-400">
                                ({result.results.filter(r => r.isCorrect).length} / {result.results.length} Correct)
                            </span>
                        </p>

                        {!result.passed && (
                            <p className="text-sm text-yellow-400/80 max-w-md mx-auto">
                                Don't worry! Review the material and try again to keep your streak.
                            </p>
                        )}

                        {result.streak > 0 && (
                            <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                                🔥 Streak: {result.streak} days
                            </div>
                        )}

                        <div className="pt-6">
                            {result.passed ? (
                                <button onClick={onClose} className="btn-primary">Continue Learning</button>
                            ) : (
                                <button onClick={() => { setResult(null); setAnswers({}); }} className="btn-secondary">
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {questions.map((q, index) => (
                            <div key={q._id || index} className="space-y-4">
                                <h3 className="text-lg font-medium text-white">
                                    <span className="text-indigo-400 mr-2">{index + 1}.</span>
                                    {q.question}
                                </h3>
                                <div className="space-y-2 pl-4">
                                    {q.options.map((opt, oIndex) => (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleOptionSelect(index, oIndex)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${answers[index] === oIndex
                                                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                                : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-6 border-t border-white/10">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`btn-primary px-8 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? 'Submitting...' : 'Submit Assessment'}
                            </button>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
