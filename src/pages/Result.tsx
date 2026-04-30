import { useMemo, useRef, useState, useEffect } from 'react';
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
          title: person.chineseName,
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

  // 计算人格在列表中的顺序编号
  const noNumber = useMemo(() => {
    if (!result) return '001';
    const idx = personalityTypes.findIndex(p => p.subtitle === result.subtitle);
    return idx >= 0 ? String(idx + 1).padStart(3, '0') : '001';
  }, [result]);

  // Preload share card image
  useEffect(() => {
    if (result?.image) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = result.image;
    }
  }, [result?.image]);

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
        backgroundColor: '#F5F0E8',
        logging: false,
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
                className="w-80 h-80 object-contain drop-shadow-lg"
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
          fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div style={{ width: '375px', background: '#F5F0E8', paddingBottom: '28px' }}>
          {/* 顶部栏 - 使用float避免absolute错位 */}
          <div style={{ padding: '16px 20px 12px', overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                background: '#F97316',
                marginRight: '6px',
                verticalAlign: 'middle',
              }} />
              <span style={{ fontSize: '10px', color: '#1a1a1a', fontWeight: 600, letterSpacing: '1px', verticalAlign: 'middle' }}>
                SGTI PERSONALITY TEST
              </span>
            </div>
            <div style={{ float: 'right', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#1a1a1a', fontWeight: 600 }}>NO. {noNumber}</span>
              <div style={{ marginTop: '2px' }}>
                <span style={{ display: 'inline-block', width: '1px', height: '10px', background: '#1a1a1a', marginRight: '3px' }} />
                <span style={{ display: 'inline-block', width: '1px', height: '10px', background: '#1a1a1a', marginRight: '3px' }} />
                <span style={{ display: 'inline-block', width: '1px', height: '10px', background: '#1a1a1a', marginRight: '3px' }} />
                <span style={{ display: 'inline-block', width: '1px', height: '10px', background: '#1a1a1a' }} />
              </div>
            </div>
            <div style={{ clear: 'both' }} />
          </div>

          {/* 主标题 */}
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>三国杀人格测试结果</h2>
            <div style={{ width: '90%', height: '1px', background: '#1a1a1a', margin: '8px auto 0' }} />
          </div>

          {/* 超大代码 */}
          <div style={{ textAlign: 'center', padding: '12px 20px 8px' }}>
            <p style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#1a1a1a',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '2px',
            }}>
              {result.subtitle}
            </p>
          </div>

          {/* 人物配图 - 去掉固定高度和object-fit，让图片自然比例显示 */}
          {result.image && (
            <div style={{ padding: '0 20px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                border: '3px solid #1a1a1a',
                borderRadius: '12px',
                background: '#ffffff',
                overflow: 'hidden',
                position: 'relative',
                maxWidth: '335px',
              }}>
                <img
                  src={result.image}
                  alt={result.title}
                  crossOrigin="anonymous"
                  style={{
                    width: '329px',
                    height: 'auto',
                    display: 'block',
                    padding: '0',
                  }}
                />
                {/* 右侧橙色装饰条 - 紧跟图片高度 */}
                <div style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  width: '6px',
                  height: '100%',
                  background: '#F97316',
                }} />
              </div>
            </div>
          )}

          {/* 人物和人格标签 */}
          <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', marginRight: '8px', marginBottom: '6px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: '#1a1a1a',
                color: '#ffffff',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
              }}>
                人物：{result.type}
              </span>
            </div>
            <div style={{ display: 'inline-block', marginBottom: '6px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: '#F97316',
                color: '#1a1a1a',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
              }}>
                人格：{result.tag}
              </span>
            </div>
          </div>

          {/* 金句 - 去掉absolute引号，改用普通行内元素 */}
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{
              width: '335px',
              margin: '0 auto',
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '18px 20px',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '22px', color: '#F97316', fontWeight: 900, lineHeight: 1, verticalAlign: 'top' }}>"</span>
              <span style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, lineHeight: 1.6, margin: '0 4px' }}>
                {result.quote.replace(/[「」]/g, '')}
              </span>
              <span style={{ fontSize: '22px', color: '#9CA3AF', fontWeight: 900, lineHeight: 1, verticalAlign: 'bottom' }}>"</span>
            </div>
          </div>

          {/* 人格深度解析 */}
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{
              width: '335px',
              margin: '0 auto',
              border: '1.5px solid #1a1a1a',
              borderRadius: '12px',
              background: '#ffffff',
              padding: '16px',
              boxSizing: 'border-box',
            }}>
              {/* 标题栏 */}
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  background: '#F97316',
                  borderRadius: '50%',
                  marginRight: '6px',
                  verticalAlign: 'middle',
                }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', verticalAlign: 'middle' }}>
                  人格深度解析
                </span>
                <span style={{
                  fontSize: '10px',
                  color: '#9CA3AF',
                  marginLeft: '8px',
                  verticalAlign: 'middle',
                  fontWeight: 600,
                }}>
                  / ANALYSIS
                </span>
              </div>
              {/* 描述文字 */}
              <p style={{
                fontSize: '12px',
                color: '#374151',
                lineHeight: 1.8,
                margin: '12px 0 0 0',
              }}>
                {result.description}
              </p>
            </div>
          </div>

          {/* 底部提示 */}
          <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: '#E5E7EB',
              color: '#6B7280',
              borderRadius: '16px',
              fontSize: '11px',
            }}>
              测试结果无科学依据，仅供娱乐！
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
