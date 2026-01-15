import React, { useMemo, useState, useRef } from 'react';
import { ItineraryData, TripRequest, DaySchedule } from '../types';

interface OutputDisplayProps {
  data: ItineraryData | null;
  request: TripRequest;
  onDataChange: (newData: ItineraryData) => void;
  onTranslate?: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, request, onDataChange, onTranslate }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [isEditing, setIsEditing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Temporary state for editing
  const [editData, setEditData] = useState<ItineraryData | null>(null);

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!request) return { total: 0, deposit: 0, balance: 0 };
    
    const adultTotal = request.adults * request.adultPrice;
    const childTotal = request.children * request.childPrice;
    const total = adultTotal + childTotal;
    
    let deposit = 0;
    if (request.depositType === 'percent') {
        deposit = Math.round(total * (request.depositValue / 100));
    } else {
        deposit = request.depositValue;
    }
    const balance = total - deposit;
    return { total, deposit, balance };
  }, [request]);

  const guideTextMap: Record<string, string> = {
    'Driver-Guide': '司机兼导',
    'Chinese-Guide': '中文导游',
    'English-Guide': '英文导游',
  };
  const guideModeText = guideTextMap[request.guideMode] || '司机兼导';

  // Start Editing
  const handleEditStart = () => {
    setEditData(JSON.parse(JSON.stringify(data))); // Deep copy
    setIsEditing(true);
    setShareLink(null);
  };

  // Save Edits
  const handleSave = () => {
    if (editData) {
        // Recalculate days count
        editData.duration_days = editData.itinerary.length;
        editData.duration_nights = Math.max(0, editData.itinerary.length - 1);
        onDataChange(editData);
    }
    setIsEditing(false);
  };

  // Add Day
  const handleAddDay = () => {
      if (!editData) return;
      const newDayNo = editData.itinerary.length + 1;
      const newDay: DaySchedule = {
          day_no: newDayNo,
          title: "新增行程",
          highlights: [],
          segments: [{ type: "sight", description: "请输入行程安排..." }],
          stay: "待定",
          meals: { breakfast: "含", lunch: "自理", dinner: "自理" },
          tips: []
      };
      setEditData({
          ...editData,
          itinerary: [...editData.itinerary, newDay]
      });
  };

  // Delete Day
  const handleDeleteDay = (index: number) => {
      if (!editData) return;
      const newItinerary = editData.itinerary.filter((_, i) => i !== index);
      // Re-index days
      newItinerary.forEach((day, i) => day.day_no = i + 1);
      setEditData({ ...editData, itinerary: newItinerary });
  };

  // Drag Sorting
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      dragOverItem.current = position;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (!editData || dragItem.current === null || dragOverItem.current === null) return;
      
      const copyListItems = [...editData.itinerary];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      
      // Re-index
      copyListItems.forEach((day, i) => day.day_no = i + 1);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setEditData({ ...editData, itinerary: copyListItems });
  };

  // Generate Link
 const handleGenerateLink = () => {
  const randomId = Math.random().toString(36).substring(7);
  setShareLink(`${window.location.origin}/share/p/${randomId}`);
};


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Rendering Helpers ---

  const renderBasicInfo = () => (
    <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 leading-snug mb-3">{data?.title}</h2>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 space-y-2">
            <div><span className="font-bold">行程概览：</span>{data?.route_overview}</div>
            <div><span className="font-bold">适合人群：</span>{data?.defaults.target_audience}</div>
            <div><span className="font-bold">出行方式：</span>{data?.defaults.transport}</div>
        </div>
    </div>
  );

  const renderDayPreview = (day: DaySchedule, index: number) => {
    const isLast = index === (data?.itinerary.length || 0) - 1;
    // Meal logic override
    const breakfast = request.includeMeals ? day.meals.breakfast : (day.meals.breakfast.includes('含') ? day.meals.breakfast : '自理');
    const lunch = request.includeMeals ? day.meals.lunch : '自理';
    const dinner = request.includeMeals ? day.meals.dinner : '自理';
    
    // Format text
    const routeChain = day.segments.map(s => s.description).join(' → ');

    return (
        <div key={day.day_no} className="mb-6 relative">
            {/* Header: Day X | Title */}
            <div className="flex items-baseline gap-2 mb-3">
                 <span className="text-lg font-bold text-slate-900 whitespace-nowrap">Day{day.day_no}｜</span>
                 <span className="text-base font-bold text-slate-800">{day.title.split('：')[0]}</span>
                 <span className="text-sm text-slate-500">{day.title.split('：')[1] || ''}</span>
            </div>
            
            <div className="pl-0 space-y-2 text-sm text-slate-700">
                <div className="flex items-start">
                    <span className="font-bold min-w-[48px] text-slate-900">行程：</span>
                    <span className="leading-relaxed">{routeChain}</span>
                </div>
                 <div className="flex items-start">
                    <span className="font-bold min-w-[48px] text-slate-900">住：</span>
                    <span>{day.stay}</span>
                </div>
                 <div className="flex items-start">
                    <span className="font-bold min-w-[48px] text-slate-900">餐：</span>
                    <span>早{breakfast}｜中{lunch}｜晚{dinner}</span>
                </div>
                {day.tips && day.tips.length > 0 && (
                     <div className="flex items-start">
                        <span className="font-bold min-w-[48px] text-slate-900">提示：</span>
                        <span className="text-amber-700">{day.tips[0]}</span>
                    </div>
                )}
            </div>

            {/* Separator Line */}
            {!isLast && (
                <div className="mt-6 border-b border-dashed border-slate-300"></div>
            )}
        </div>
    );
  };

  const renderEditSection = (
      title: string, 
      items: string[], 
      onChange: (newItems: string[]) => void
  ) => (
      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2">{title}</h4>
          <textarea 
              value={items.join('\n')}
              onChange={(e) => onChange(e.target.value.split('\n'))}
              className="w-full h-32 p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="每行一条"
          />
      </div>
  );

  const renderEditDay = (day: DaySchedule, index: number) => (
    <div 
        key={index} 
        className="mb-6 p-4 border border-blue-200 bg-blue-50/30 rounded-lg cursor-move hover:bg-blue-100 transition-colors relative group"
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnter={(e) => handleDragEnter(e, index)}
        onDragEnd={handleDrop}
        onDragOver={(e) => e.preventDefault()}
    >
        <div className="flex items-center justify-between mb-3 border-b border-blue-200 pb-2">
            <span className="font-bold text-blue-800 flex items-center gap-2">
                <span>☰</span> Day {day.day_no}
            </span>
            <button 
                onClick={() => handleDeleteDay(index)}
                className="text-red-500 text-xs hover:bg-red-100 px-2 py-1 rounded"
            >
                删除
            </button>
        </div>
        
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">标题</label>
                <input 
                    type="text" 
                    value={day.title}
                    onChange={(e) => {
                        const newItinerary = [...editData!.itinerary];
                        newItinerary[index].title = e.target.value;
                        setEditData({...editData!, itinerary: newItinerary});
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">行程内容 (用 "→" 连接)</label>
                <textarea 
                    value={day.segments.map(s => s.description).join(' → ')}
                    onChange={(e) => {
                        const newItinerary = [...editData!.itinerary];
                        const parts = e.target.value.split(/→|->/).map(s => s.trim());
                        newItinerary[index].segments = parts.map(p => ({
                            type: 'sight',
                            description: p
                        }));
                        setEditData({...editData!, itinerary: newItinerary});
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">酒店</label>
                     <input 
                        type="text" 
                        value={day.stay}
                        onChange={(e) => {
                            const newItinerary = [...editData!.itinerary];
                            newItinerary[index].stay = e.target.value;
                            setEditData({...editData!, itinerary: newItinerary});
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                    />
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">提示</label>
                     <input 
                        type="text" 
                        value={day.tips?.[0] || ''}
                        onChange={(e) => {
                            const newItinerary = [...editData!.itinerary];
                            newItinerary[index].tips = [e.target.value];
                            setEditData({...editData!, itinerary: newItinerary});
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                    />
                </div>
            </div>

            {/* Meal Editing */}
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">用餐 (早/中/晚)</label>
                <div className="grid grid-cols-3 gap-2">
                    <input 
                        type="text" 
                        placeholder="早餐"
                        value={day.meals.breakfast}
                        onChange={(e) => {
                            const newItinerary = [...editData!.itinerary];
                            newItinerary[index].meals.breakfast = e.target.value;
                            setEditData({...editData!, itinerary: newItinerary});
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-sm text-center"
                    />
                     <input 
                        type="text" 
                        placeholder="午餐"
                        value={day.meals.lunch}
                        onChange={(e) => {
                            const newItinerary = [...editData!.itinerary];
                            newItinerary[index].meals.lunch = e.target.value;
                            setEditData({...editData!, itinerary: newItinerary});
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-sm text-center"
                    />
                     <input 
                        type="text" 
                        placeholder="晚餐"
                        value={day.meals.dinner}
                        onChange={(e) => {
                            const newItinerary = [...editData!.itinerary];
                            newItinerary[index].meals.dinner = e.target.value;
                            setEditData({...editData!, itinerary: newItinerary});
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-sm text-center"
                    />
                </div>
            </div>
        </div>
    </div>
  );

  // --- Main Render ---

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-xl border border-dashed border-slate-300 min-h-[500px]">
        <span className="text-4xl mb-4">✨</span>
        <p>准备生成行程方案</p>
        <p className="text-sm">请选择模板或输入详情生成。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden relative">
        {/* Header Actions */}
        <div className="flex border-b bg-white items-center justify-between px-2">
            <div className="flex overflow-x-auto">
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'preview' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                >
                    📱 网页版预览
                </button>
                <button
                    onClick={() => setActiveTab('json')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'json' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                >
                    💾 JSON 数据
                </button>
            </div>
            {activeTab === 'preview' && !isEditing && !shareLink && (
                <div className="flex gap-2 items-center pr-2">
                    {onTranslate && data.mode !== 'C' && (
                        <button
                            onClick={onTranslate}
                            className="hidden md:flex text-indigo-600 hover:text-indigo-800 text-xs font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors items-center gap-1 border border-indigo-200"
                        >
                            🇺🇸 Translate to English
                        </button>
                    )}
                     <button 
                        onClick={handleEditStart}
                        className="text-slate-600 hover:text-blue-600 text-sm font-medium px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                        ✏️ 修改
                    </button>
                    <button 
                        onClick={handleGenerateLink}
                        className="text-white text-sm font-medium px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-full transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
                    >
                        📤 分享
                    </button>
                </div>
            )}
            {isEditing && (
                 <div className="flex gap-2 py-2 pr-2">
                     <button 
                        onClick={() => setIsEditing(false)}
                        className="text-slate-600 text-sm font-medium px-3 py-1 hover:bg-slate-100 rounded-full"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSave}
                        className="text-white text-sm font-medium px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"
                    >
                        💾 保存
                    </button>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-slate-100">
            {activeTab === 'preview' ? (
                <div className="h-full overflow-y-auto p-4 flex justify-center scroll-smooth">
                     
                     {isEditing ? (
                         /* Edit Mode */
                         <div className="w-full max-w-[600px] bg-white shadow-xl rounded-xl p-6 min-h-full">
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
                                 <span>📝</span> 编辑行程内容
                             </h3>
                             <p className="text-xs text-slate-400 mb-4">提示：长按天数卡片可以拖拽排序</p>
                             
                             <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 mb-1">行程标题</label>
                                <input 
                                    type="text" 
                                    value={editData?.title}
                                    onChange={(e) => setEditData({...editData!, title: e.target.value})}
                                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                             </div>

                             <div className="space-y-4">
                                {editData?.itinerary.map((day, idx) => renderEditDay(day, idx))}
                             </div>

                             <button 
                                onClick={handleAddDay}
                                className="w-full py-3 mt-4 border-2 border-dashed border-blue-300 text-blue-500 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                             >
                                 <span>+</span> 新增一天行程
                             </button>
                             
                             <div className="mt-8 border-t pt-6">
                                {/* Edit Sections */}
                                {renderEditSection("包含项目", editData?.includes || [], (val) => setEditData({...editData!, includes: val}))}
                                {renderEditSection("不含项目", editData?.excludes || [], (val) => setEditData({...editData!, excludes: val}))}
                                {renderEditSection("注意事项", editData?.notes || [], (val) => setEditData({...editData!, notes: val}))}
                             </div>
                         </div>
                     ) : (
                         /* Preview Mode (Phone Mockup) */
                         <div className="w-full max-w-[375px] bg-white shadow-2xl min-h-[800px] flex flex-col rounded-lg overflow-hidden border border-slate-200">
                            {/* Fake Browser Bar */}
                            <div className="bg-slate-800 text-white p-3 text-xs flex justify-between items-center sticky top-0 z-20">
                               <span>{window.location.host}/share...</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 p-5 text-slate-800 font-sans overflow-y-auto">
                                {/* Header Image Placeholder */}
                                <div className="relative w-full h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-6 flex flex-col items-center justify-center text-white shadow-lg p-4 text-center">
                                    <h1 className="font-bold text-lg leading-snug drop-shadow-md">
                                        {data.title.split('｜')[0]}
                                    </h1>
                                    <div className="absolute bottom-[-15px] bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-bold shadow-sm border border-blue-50">
                                        编号: {data.template_code}
                                    </div>
                                </div>
                                
                                {renderBasicInfo()}

                                <div className="mb-6">
                                     {data.itinerary.map((day, idx) => renderDayPreview(day, idx))}
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-slate-900 mb-2">行程天数</h4>
                                    <p className="text-sm">{data.duration_days}天{data.duration_nights}晚</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                     <h3 className="font-bold text-slate-900 mb-3 border-b pb-2">行程价格</h3>
                                     <div className="flex justify-between items-center mb-1">
                                         <span className="text-sm text-slate-600">总价</span>
                                         <span className="text-lg font-bold text-red-600">{request.currency}{pricing.total.toLocaleString()}</span>
                                     </div>
                                     <div className="text-xs text-slate-400 text-right mb-3 flex flex-col">
                                         <span>成人: {request.currency}{request.adultPrice} × {request.adults}人</span>
                                         {request.children > 0 && (
                                            <span>儿童: {request.currency}{request.childPrice} × {request.children}人</span>
                                         )}
                                     </div>
                                     <div className="text-xs text-slate-500 space-y-1">
                                         <div className="flex justify-between">
                                             <span>定金 ({request.depositType === 'percent' ? `${request.depositValue}%` : '固定'})</span>
                                             <span>{request.currency}{pricing.deposit.toLocaleString()}</span>
                                         </div>
                                         <div className="flex justify-between">
                                             <span>尾款 (出发前7天)</span>
                                             <span>{request.currency}{pricing.balance.toLocaleString()}</span>
                                         </div>
                                     </div>
                                </div>

                                <div className="mb-6 text-sm">
                                    <h4 className="font-bold text-slate-900 mb-2">费用包含</h4>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                        {data.includes.map((item, i) => <li key={i}>{item}</li>)}
                                        <li>服务：{guideModeText}</li>
                                    </ul>
                                </div>

                                <div className="mb-6 text-sm">
                                    <h4 className="font-bold text-slate-900 mb-2">费用不包含</h4>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                        {data.excludes.map((item, i) => <li key={i}>{item}</li>)}
                                        {!request.includeMeals && <li>用餐：正餐自理</li>}
                                    </ul>
                                </div>
                                
                                {data.notes.length > 0 && (
                                    <div className="mb-6 text-sm">
                                        <h4 className="font-bold text-slate-900 mb-2">注意事项</h4>
                                        <ul className="list-decimal pl-4 space-y-1 text-slate-600">
                                            {data.notes.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="text-center pb-8 border-t pt-6">
                                    <p className="font-bold text-slate-800 text-sm">本行程由客服 {request.contactName} 定制</p>
                                    <p className="text-xs text-slate-500 mt-1">联系方式：{request.contactInfo}</p>
                                    <button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg w-full transform active:scale-95 transition-all text-sm">
                                        联系客服 确认行程
                                    </button>
                                </div>
                            </div>
                         </div>
                     )}
                </div>
            ) : (
                <div className="h-full overflow-y-auto p-4 bg-slate-900 text-green-400 font-mono text-xs">
                    <pre>{JSON.stringify({ ...data, pricing: pricing }, null, 2)}</pre>
                </div>
            )}

            {/* Share Overlay */}
            {shareLink && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🚀
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">网页版已生成</h3>
                        <p className="text-sm text-slate-500 mb-6">您可以复制下方链接发送给客户，客户可在手机端完美预览。</p>
                        
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-600 break-all mb-4 select-all font-mono">
                            {shareLink}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                             <button 
                                onClick={() => setShareLink(null)}
                                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                            >
                                关闭
                            </button>
                            <button 
                                onClick={() => handleCopy(shareLink)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md"
                            >
                                {copied ? '已复制' : '复制链接'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
