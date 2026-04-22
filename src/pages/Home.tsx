import { useNavigate } from 'react-router';
import { questions } from '../data/questions';
import { clearProgress } from '../utils/calculator';

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    clearProgress();
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 标题区域 */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            性格成分鉴定
          </h1>
          <p className="text-lg text-gray-600">
            通过 20 道情境题，深度剖析你的性格密码
          </p>
        </div>

        {/* 人格类型预览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          {[
            { emoji: '🎭', label: '多面性格' },
            { emoji: '🔮', label: '独特灵魂' },
            { emoji: '⚡', label: '隐藏特质' },
            { emoji: '💫', label: '无限可能' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="text-sm font-medium text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>

        {/* 测试说明 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">关于本次测试</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="space-y-1">
              <div className="font-medium text-gray-800">{questions.length} 道题目</div>
              <div>情境选择题，更贴近真实</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-800">5 大维度</div>
              <div>全面分析你的性格特征</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-800">3-5 分钟</div>
              <div>快速完成，即时获取结果</div>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          开始测试
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* 底部提示 */}
        <p className="text-xs text-gray-400 mt-8">
          请选择最符合你真实想法的选项，而非你认为"正确"的答案
        </p>
      </div>
    </div>
  );
}
