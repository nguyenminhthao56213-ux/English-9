
import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, XCircle, Info, RefreshCw, Trophy } from 'lucide-react';
import { generateQuestions } from '../services/geminiService';
import { Question } from '../types';
import confetti from 'canvas-confetti';

const TOPICS = [
  "Local Community (Adjective comparison)",
  "City Life (Phrasal verbs)",
  "Teenagers (Reported speech)",
  "Life in the past (Used to/Wish)",
  "Our heritage (Passive voice)",
  "Lifestyles (Gerund vs Infinitive)",
  "Environment (Conditional Type 1 & 2)",
  "Shopping (Relative Clauses)"
];

const ExerciseLibrary: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const startQuiz = async () => {
    if (selectedTopics.length === 0) return;
    setIsLoading(true);
    try {
      const q = await generateQuestions(selectedTopics);
      setQuestions(q);
      setCurrentIdx(0);
      setAnswers([]);
      setShowResult(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
      const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0);
      if (score === questions.length) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  if (questions.length > 0 && !showResult) {
    const q = questions[currentIdx];
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Câu hỏi {currentIdx + 1}/{questions.length}</h3>
          <div className="h-2 w-48 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          <p className="text-2xl font-bold leading-relaxed">{q.question}</p>
          
          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`
                  p-6 rounded-2xl border-2 text-left transition-all text-lg font-medium
                  ${answers[currentIdx] === i 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.01]' 
                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={nextQuestion}
              disabled={answers[currentIdx] === undefined}
              className="px-8 py-4 bg-gradient-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {currentIdx === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0);
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-black">Hoàn thành bài tập!</h2>
          <p className="text-xl text-gray-500">
            Bạn trả lời đúng <span className="text-blue-600 font-bold">{score}/{questions.length}</span> câu hỏi.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className={`p-6 bg-white rounded-3xl border ${answers[i] === q.answer ? 'border-green-100' : 'border-red-100'}`}>
              <div className="flex items-start gap-4">
                {answers[i] === q.answer ? (
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 space-y-3">
                  <p className="text-lg font-bold">{q.question}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">Đáp án của bạn: <span className={answers[i] === q.answer ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{q.options[answers[i]]}</span></p>
                    {answers[i] !== q.answer && (
                      <p className="text-sm">Đáp án đúng: <span className="text-green-600 font-bold">{q.options[q.answer]}</span></p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                    <Info size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 italic">{q.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => setQuestions([])}
            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl"
          >
            Làm bài tập khác <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black">Luyện tập cá nhân hóa</h2>
        <p className="text-gray-500 text-lg">Chọn chủ điểm bạn muốn ôn tập, AI sẽ tạo bài tập riêng cho bạn.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic, i) => (
          <button
            key={i}
            onClick={() => toggleTopic(topic)}
            className={`
              p-6 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-40
              ${selectedTopics.includes(topic)
                ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-50 shadow-inner'
                : 'border-white bg-white shadow-sm hover:border-blue-200'}
            `}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedTopics.includes(topic) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Sparkles size={20} />
            </div>
            <span className={`font-bold leading-tight ${selectedTopics.includes(topic) ? 'text-blue-700' : 'text-gray-700'}`}>
              {topic}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={startQuiz}
          disabled={selectedTopics.length === 0 || isLoading}
          className="px-12 py-5 bg-gradient-primary text-white rounded-3xl font-black text-xl flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <RefreshCw className="animate-spin" size={28} />
          ) : (
            <Sparkles size={28} />
          )}
          Bắt đầu luyện tập
        </button>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
