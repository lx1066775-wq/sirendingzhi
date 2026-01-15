import React from 'react';
import { TripRequest, ItineraryMode } from '../types';
import { TEMPLATES } from '../services/templates';

interface InputFormProps {
  request: TripRequest;
  onChange: (field: keyof TripRequest, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  selectedTemplateId: string | null;
  onTemplateSelect: (id: string | null) => void;
}

const GUIDE_MODES = [
  { value: 'Driver-Guide', label: '🚗 司机兼导' },
  { value: 'Chinese-Guide', label: '🇨🇳 中文导游' },
  { value: 'English-Guide', label: '🇬🇧 英文导游' },
];

const MODES: { value: ItineraryMode; label: string; desc: string }[] = [
  { value: 'A', label: '🇨🇳 国内游客', desc: '全中文 / 地气 / 实用' },
  { value: 'B', label: '🇸🇬 新马客户', desc: '中英混排 / 国际化' },
  { value: 'C', label: '🇺🇸 全英文', desc: 'English Only' },
];

export const InputForm: React.FC<InputFormProps> = ({ 
  request, 
  onChange, 
  onSubmit, 
  loading,
  selectedTemplateId,
  onTemplateSelect
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col gap-5 overflow-y-auto">
      <div className="border-b pb-4 mb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🛠️</span> 定制行程
        </h2>
        <p className="text-sm text-slate-500 mt-1">请选择客户类型及方案模板。</p>
      </div>

      {/* Mode Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">1. 客户类型 (输出模式)</label>
        <div className="grid grid-cols-1 gap-2">
            {MODES.map((m) => (
                <button
                    key={m.value}
                    onClick={() => onChange('mode', m.value)}
                    className={`flex items-center p-3 rounded-lg border text-left transition-all ${
                        request.mode === m.value
                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                         request.mode === m.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                    }`}>
                        {request.mode === m.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${request.mode === m.value ? 'text-indigo-900' : 'text-slate-700'}`}>{m.label}</div>
                        <div className="text-xs text-slate-500">{m.desc}</div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Days Input */}
      <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">2. 游玩天数</label>
          <div className="flex items-center gap-2">
              <input 
                  type="number"
                  min={1}
                  value={request.days}
                  onChange={(e) => onChange('days', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
              />
              <span className="text-sm text-slate-600 font-medium whitespace-nowrap">天</span>
          </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase">3. 选择方案模板</label>
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
            <button
                onClick={() => onTemplateSelect(null)}
                className={`p-3 text-left rounded-lg border text-sm transition-all ${
                    selectedTemplateId === null 
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
            >
                <span className="font-bold block">✨ AI 智能定制</span>
                <span className="text-xs opacity-75">根据下方需求自动生成</span>
            </button>
            {Object.entries(TEMPLATES).map(([id, tpl]) => (
                <button
                    key={id}
                    onClick={() => onTemplateSelect(id)}
                    className={`p-3 text-left rounded-lg border text-sm transition-all ${
                        selectedTemplateId === id
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                    <span className="font-bold block truncate">{tpl.title.split('｜')[0]}</span>
                    <span className="text-xs opacity-75">{tpl.duration_days}天{tpl.duration_nights}晚 | {tpl.tags.join(' ')}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Global Config */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
         <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">用餐配置</label>
            <div className="flex items-center gap-2 mt-2">
                <div 
                    onClick={() => onChange('includeMeals', !request.includeMeals)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${request.includeMeals ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${request.includeMeals ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm text-slate-700">{request.includeMeals ? '包含正餐' : '不含正餐'}</span>
            </div>
         </div>
         <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">带团方式</label>
            <select 
                value={request.guideMode}
                onChange={(e) => onChange('guideMode', e.target.value)}
                className="w-full mt-1 p-1 bg-white border border-slate-200 rounded text-sm outline-none"
            >
                {GUIDE_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
         </div>
      </div>

      {/* Pax & Price Split */}
      <div className="border-t pt-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">人数与报价 ({request.currency})</label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {/* Adult */}
            <div className="flex items-center gap-2">
                <span className="text-sm w-10">成人</span>
                <input
                    type="number" min={1}
                    value={request.adults}
                    onChange={(e) => onChange('adults', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-center text-sm"
                />
                <span className="text-sm text-slate-400">人</span>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-sm text-slate-400">单价</span>
                <input
                    type="number" min={0}
                    value={request.adultPrice}
                    onChange={(e) => onChange('adultPrice', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                />
            </div>
            
            {/* Child */}
            <div className="flex items-center gap-2">
                <span className="text-sm w-10">儿童</span>
                <input
                    type="number" min={0}
                    value={request.children}
                    onChange={(e) => onChange('children', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-center text-sm"
                />
                <span className="text-sm text-slate-400">人</span>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-sm text-slate-400">单价</span>
                <input
                    type="number" min={0}
                    value={request.childPrice}
                    onChange={(e) => onChange('childPrice', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                />
            </div>
        </div>
      </div>

      {/* Deposit Rules */}
      <div className="border-t pt-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">付款方式</label>
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={request.depositType === 'percent'}
              onChange={() => onChange('depositType', 'percent')}
              className="text-blue-600"
            />
            <span className="text-sm">百分比(%)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={request.depositType === 'fixed'}
              onChange={() => onChange('depositType', 'fixed')}
              className="text-blue-600"
            />
            <span className="text-sm">固定金额</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">定金:</span>
            <input
                type="number"
                value={request.depositValue}
                onChange={(e) => onChange('depositValue', parseFloat(e.target.value))}
                className="w-24 px-2 py-1 border rounded text-right text-sm"
            />
            <span className="text-sm text-slate-400">
                {request.depositType === 'percent' ? '%' : request.currency}
            </span>
        </div>
      </div>

      {/* Contact Info */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">客服昵称</label>
          <input
            type="text"
            value={request.contactName}
            onChange={(e) => onChange('contactName', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg outline-none text-sm"
            placeholder="{客服姓名}"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">联系方式</label>
          <input
            type="text"
            value={request.contactInfo}
            onChange={(e) => onChange('contactInfo', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg outline-none text-sm"
            placeholder="{手机/微信}"
          />
        </div>
      </div>

      {/* AI Only Details */}
      {selectedTemplateId === null && (
          <div className="flex-1 border-t pt-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">AI 需求 / 路线草稿</label>
            <textarea
              value={request.requirements}
              onChange={(e) => onChange('requirements', e.target.value)}
              className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-xs font-mono leading-relaxed bg-slate-50"
              placeholder="在此粘贴具体路线或输入要求..."
            />
          </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${
          loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01]'
        }`}
      >
        {loading ? '生成中...' : (selectedTemplateId ? '📝 加载模板并编辑' : '✨ AI 生成方案')}
      </button>
    </div>
  );
};