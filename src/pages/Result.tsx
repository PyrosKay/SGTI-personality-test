import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { loadProgress, calculateDimensions, generatePersonalityResult, clearProgress } from '../utils/calculator';

export default function Result() {
  const navigate = useNavigate();

  const result = useMemo(() => {
    const progress = loadProgress();
    if (!progress) {
      return null;
    }

    const dimensions = calculateDimensions(progress.answers);
    const personalityResult = generatePersonalityResult(dimensions);

    return personalityResult;
  }, []);

  const handleRestart = () => {
    clearProgress();
    navigate('/');
  };

  const handleShare = async () => {
    const shareText = `我刚刚做了三国杀性格鉴定，结果是"${result?.title} (${result?.subtitle})"！你也来试试吧~`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SGTI 三国杀人格测试',
          text: shareText,
        });
      } catch {
        // 用户取消分享
      }
    } else {
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareText);
      alert('结果已复制到剪贴板！');
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">未找到测试结果</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
          >
            重新测试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* 顶部背景 */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center text-white space-y-4">
          <p className="text-sm uppercase tracking-widest text-amber-200">SGTI 三国杀人格测试结果</p>
          <h1 className="text-3xl md:text-4xl font-bold">{result.title}</h1>
          <p className="text-lg text-amber-100">{result.subtitle}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 space-y-6">
        {/* 人格描述卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          {result.image && (
            <div className="flex justify-center">
              <img
                src={result.image}
                alt={result.title}
                className="w-64 h-64 object-contain drop-shadow-lg"
              />
            </div>
          )}

          {/* 毒舌点评 */}
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-600">
            <p className="text-gray-600 italic">{result.quote}</p>
          </div>

          <p className="mt-5 text-gray-700 leading-relaxed">{result.description}</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享结果
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
}
