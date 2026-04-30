import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import html2canvas from 'html2canvas';
import { loadProgress, calculateDimensions, generatePersonalityResult, clearProgress, personalityTypes } from '../utils/calculator';

export default function Result() {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const result = useMemo(() => {
    // Preview mode: directly show personality by code
    if (code) {
      const person = personalityTypes.find(p => p.subtitle === code);
      if (person) {
        return {
          type: person.chineseName,
          title: `${person.chineseName} · ${person.englishName}`,
          subtitle: person.subtitle,
          tag: person.englishName,
          description: person.description,
          quote: person.quote,
          image: person.image,
          dimensions: [],
        };
      }
    }

    const progress = loadProgress();
    if (!progress) {
      return null;
    }

    const dimensions = calculateDimensions(progress.answers);
    const personalityResult = generatePersonalityResult(dimensions);

    return personalityResult;
  }, [code]);

  const handleRestart = () => {
    clearProgress();
    navigate('/');
  };

  const handleGenerateImage = async () => {
    if (!shareCardRef.current || !result) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `三国杀人格测试_${result.type || '结果'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('图片生成失败，请重试');
    } finally {
      setIsGenerating(false);
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
          <p className="text-base text-amber-200 font-medium">{result.tag}</p>
          <p className="text-sm text-amber-300/80 font-mono">{result.subtitle}</p>
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
          <p className="mt-4 text-xs text-gray-400 text-center">测试结果无科学依据，仅供娱乐！</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="w-full sm:w-auto px-10 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isGenerating ? '生成中...' : '生成分享图片'}
            </span>
          </button>
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-10 py-3 bg-white text-gray-900 rounded-full font-medium border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新测试
            </span>
          </button>
        </div>
      </div>

      {/* 隐藏的分享卡片 - 用于生成图片 */}
      <div
        ref={shareCardRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '375px',
        }}
      >
        <div
          style={{
            width: '375px',
            padding: '32px 28px',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
            textAlign: 'center',
          }}
        >
          {/* 顶部标题 */}
          <p style={{ fontSize: '12px', color: '#fcd34d', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
            SGTI 三国杀人格测试
          </p>

          {/* 人格图片 */}
          {result.image && (
            <img
              src={result.image}
              alt={result.title}
              crossOrigin="anonymous"
              style={{
                width: '180px',
                height: 'auto',
                maxHeight: '220px',
                objectFit: 'contain',
                marginBottom: '16px',
              }}
            />
          )}

          {/* 人格名称 */}
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0', textAlign: 'center' }}>
            {result.title}
          </h2>

          {/* 中文称号 */}
          <p style={{ fontSize: '16px', color: '#fcd34d', margin: '0 0 4px 0', fontWeight: 500 }}>
            {result.tag}
          </p>

          {/* 代码 */}
          <p style={{ fontSize: '14px', color: '#fde68a', margin: '0 0 20px 0', fontFamily: 'monospace' }}>
            {result.subtitle}
          </p>

          {/* 金句 */}
          <div
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '8px',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          >
            <p style={{ fontSize: '14px', color: '#ffffff', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              {result.quote}
            </p>
          </div>

          {/* 简短描述 */}
          <p
            style={{
              fontSize: '13px',
              color: '#fde68a',
              lineHeight: 1.7,
              textAlign: 'center',
              margin: '0 0 20px 0',
              padding: '0 8px',
            }}
          >
            {result.description.slice(0, 80)}...
          </p>

          {/* 底部 */}
          <div>
            <p style={{ fontSize: '11px', color: '#fcd34d', margin: 0, opacity: 0.8 }}>
              扫码测试，发现你的三国杀人格
            </p>
            <p style={{ fontSize: '10px', color: '#fde68a', margin: '4px 0 0 0', opacity: 0.6 }}>
              测试结果无科学依据，仅供娱乐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
