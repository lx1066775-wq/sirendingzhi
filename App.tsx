import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { TripRequest, ItineraryData } from './types';
import { generateItinerary, translateItinerary, GeminiModel } from './services/geminiService';
import { TEMPLATES } from './services/templates';

const DEFAULT_REQUEST: TripRequest = {
  destination: '新疆',
  days: 9,
  adults: 5,
  children: 0,
  adultPrice: 4500,
  childPrice: 2500,
  currency: '¥',
  mode: 'A',
  depositType: 'percent',
  depositValue: 30,
  contactName: '热娜',
  contactInfo: '13039498591',
  includeMeals: false,
  guideMode: 'Driver-Guide',
  requirements: '',
};

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState<GeminiModel>('gemini-2.5-flash'); // ✅ 新增：默认 Flash

  const [request, setRequest] = useState<TripRequest>(DEFAULT_REQUEST);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const [data, setData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
    }
  }, []);

  const handleRequestChange = (field: keyof TripRequest, value: any) => {
    setRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (id: string | null) => {
    setSelectedTemplateId(id);
    if (id && TEMPLATES[id]) {
      const tpl = TEMPLATES[id];
      setRequest(prev => ({
        ...prev,
        destination: '新疆',
        days: tpl.duration_days,
        requirements: ''
      }));
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      if (selectedTemplateId && TEMPLATES[selectedTemplateId]) {
        // MODE 1: Template Mode
        await new Promise(resolve => setTimeout(resolve, 600));
        const templateData = JSON.parse(JSON.stringify(TEMPLATES[selectedTemplateId]));

        if (request.mode !== 'C') {
          templateData.mode = request.mode;
        }
        setData(templateData);
      } else {
        // MODE 2: AI Mode
        if (!apiKey) {
          throw new Error('请先输入您的 Google Gemini API Key，或选择一个系统模板。');
        }
        const result = await generateItinerary(apiKey, request, model); // ✅ 传入 model
        setData(result);
      }
    } catch (err: any) {
      setError(err.message || '生成行程失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!data) return;
    if (!apiKey) {
      setError('翻译需要 API Key，请先配置 Key。');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const translatedData = await translateItinerary(apiKey, data, model); // ✅ 传入 model
      setData(translatedData);
      setRequest(prev => ({ ...prev, mode: 'C' }));
    } catch (err: any) {
      setError(err.message || '翻译失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              TravelGenius <span className="text-slate-400 font-normal">| 智能行程生成器</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 模型切换按钮 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModel("gemini-2.5-flash")}
                className={`px-2.5 py-1.5 rounded-md text-xs border ${
                  model === "gemini-2.5-flash"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
              >
                快速（Flash）
              </button>

              <button
                type="button"
                onClick={() => setModel("gemini-2.5-pro")}
                className={`px-2.5 py-1.5 rounded-md text-xs border ${
                  model === "gemini-2.5-pro"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
              >
                高质量（Pro）
              </button>
            </div>

            {!process.env.API_KEY && (
              <input
                type="password"
                placeholder="粘贴 Gemini API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-md text-sm w-48 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              获取 Key
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-64px)]">
        {/* Left: Input Form */}
        <div className="lg:col-span-4 h-full">
          <InputForm
            request={request}
            onChange={handleRequestChange}
            onSubmit={handleGenerate}
            loading={loading}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-8 h-full flex flex-col">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <OutputDisplay
            data={data}
            request={request}
            onDataChange={setData}
            onTranslate={handleTranslate}
          />
        </div>
      </main>
    </div>
  );

