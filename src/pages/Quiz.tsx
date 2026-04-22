import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { questions } from '../data/questions';
import { AnswerRecord } from '../data/types';
import { saveProgress, loadProgress } from '../utils/calculator';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 加载保存的进度
  useEffect(() => {
    const progress = loadProgress();
    if (progress) {
      setAnswers(progress.answers);
      setCurrentIndex(progress.currentIndex);
    }
  }, []);

  // 保存进度
  useEffect(() => {
    if (answers.length > 0) {
      saveProgress(answers, currentIndex);
    }
  }, [answers, currentIndex]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (isTransitioning) return;

      setSelectedOption(optionIndex);
      setIsTransitioning(true);

      // 记录答案
      const newAnswers = [
        ...answers.filter((a) => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, optionIndex },
      ];
      setAnswers(newAnswers);

      // 延迟后跳转
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsTransitioning(false);
        } else {
          // 最后一题，跳转到结果
          saveProgress(newAnswers, currentIndex);
          navigate('/result');
        }
      }, 300);
    },
    [currentIndex, currentQuestion, answers, isTransitioning, navigate]
  );

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </button>
          <div className="text-sm font-medium text-gray-900">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gray-900 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* 问题区域 */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <span className="text-lg font-semibold text-gray-900">{currentIndex + 1}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* 选项列表 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={isTransitioning}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  } ${isTransitioning ? 'pointer-events-none' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {letters[index]}
                    </span>
                    <span className="text-base leading-relaxed pt-0.5">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 提示文字 */}
          <p className="text-center text-sm text-gray-400 mt-6">
            选择后自动进入下一题
          </p>
        </div>
      </main>
    </div>
  );
}
