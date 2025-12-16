
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Family, Member, Surname, FamilyEvent } from '../types';

type EditTab = 'culture' | 'events';

export const FamilyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [surname, setSurname] = useState<Surname | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  
  // Editing State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditTab>('culture');
  const [editForm, setEditForm] = useState<Partial<Family>>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    if (id) {
      const allFamilies = DataService.getFamilies();
      const foundFamily = allFamilies.find(f => f.id === id);
      if (foundFamily) {
        setFamily(foundFamily);
        const allSurnames = DataService.getSurnames();
        setSurname(allSurnames.find(s => s.id === foundFamily.surnameId) || null);
        
        const allMembers = DataService.getMembers();
        setMembers(allMembers.filter(m => m.familyId === id));
      }
    }
  };

  const openEditModal = (tab: EditTab) => {
    if (family) {
      setEditForm(JSON.parse(JSON.stringify(family))); // Deep copy
      setActiveTab(tab);
      setIsEditModalOpen(true);
    }
  };

  const handleSave = () => {
    if (family && editForm) {
      const updatedFamily: Family = {
        ...family,
        ...editForm,
        // Ensure events is array
        events: editForm.events || []
      };
      DataService.saveFamily(updatedFamily);
      setFamily(updatedFamily); // Optimistic update
      setIsEditModalOpen(false);
    }
  };

  // Event Helper Functions
  const handleEventChange = (index: number, field: keyof FamilyEvent, value: string) => {
    const newEvents = [...(editForm.events || [])];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEditForm({ ...editForm, events: newEvents });
  };

  const addEvent = () => {
    const newEvents = [...(editForm.events || []), { year: '', title: '', description: '' }];
    setEditForm({ ...editForm, events: newEvents });
  };

  const removeEvent = (index: number) => {
    const newEvents = [...(editForm.events || [])];
    newEvents.splice(index, 1);
    setEditForm({ ...editForm, events: newEvents });
  };

  if (!family) {
    return <div className="p-8 text-center text-gray-500">正在加载家族信息...</div>;
  }

  const livingCount = members.filter(m => !m.deathDate).length;
  const generationCount = members.length > 0 ? (Math.max(...members.map(m => m.generation)) - Math.min(...members.map(m => m.generation)) + 1) : 0;
  
  // Find Tanghao Name
  const tanghao = surname?.tanghao.find(t => t.id === family.tanghaoId);

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 to-china-red rounded-xl shadow-lg text-white p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
           <i className="fas fa-dragon text-[300px]"></i>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-3">
             <button 
              onClick={() => openEditModal('culture')}
              className="bg-white/20 hover:bg-white text-white hover:text-china-red px-4 py-2 rounded backdrop-blur-sm transition-all text-sm font-bold shadow-lg"
            >
              <i className="fas fa-edit mr-2"></i>编辑资料
            </button>
            <button 
              onClick={() => navigate('/families')}
              className="bg-black/20 hover:bg-black/40 text-white px-4 py-2 rounded backdrop-blur-sm transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>返回列表
            </button>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white text-china-red rounded-full flex items-center justify-center font-serif font-bold text-5xl shadow-2xl border-4 border-noble-gold">
            {surname?.name}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-noble-gold text-red-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{tanghao?.name || '堂号未知'}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">{family.origin}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 tracking-wide">{family.name}</h1>
            <p className="text-white/80 max-w-2xl">{family.description}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-center border-r border-white/20 last:border-0">
                <span className="block text-2xl font-bold">{members.length}</span>
                <span className="text-xs text-white/70">总人数</span>
            </div>
            <div className="text-center border-r border-white/20 last:border-0">
                <span className="block text-2xl font-bold">{livingCount}</span>
                <span className="text-xs text-white/70">在世人数</span>
            </div>
             <div className="text-center border-r border-white/20 last:border-0">
                <span className="block text-2xl font-bold">{generationCount}</span>
                <span className="text-xs text-white/70">世系数</span>
            </div>
            <div className="text-center">
                <span className="block text-2xl font-bold">{family.founder || '未知'}</span>
                <span className="text-xs text-white/70">始祖</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Info & Motto */}
        <div className="space-y-6 lg:col-span-1">
             {/* Motto Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-noble-gold relative overflow-hidden group">
                <i className="fas fa-scroll absolute top-2 right-4 text-6xl text-gray-100 -z-0"></i>
                <button 
                    onClick={() => openEditModal('culture')}
                    className="absolute top-4 right-4 text-gray-400 hover:text-china-red z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="编辑家训"
                >
                    <i className="fas fa-edit"></i>
                </button>

                <h3 className="text-xl font-bold text-ink-black mb-4 flex items-center gap-2 relative z-10">
                    <i className="fas fa-pen-fancy text-china-red"></i> 家训 / 祖训
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 italic leading-relaxed border-l-2 border-china-red relative z-10 min-h-[100px]">
                   {family.motto ? (
                       family.motto.split('\n').filter(l => l.trim()).map((line, i) => <p key={i} className="mb-2 last:mb-0 border-b border-gray-100 last:border-0 pb-1 last:pb-0">{line}</p>)
                   ) : (
                       <span className="text-gray-400 text-sm">暂无家训记录，点击右上角编辑添加。</span>
                   )}
                </div>
            </div>

            {/* Migration Card */}
            <div className="bg-white rounded-xl shadow-md p-6 relative group">
                 <button 
                    onClick={() => openEditModal('culture')}
                    className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="编辑迁徙记录"
                >
                    <i className="fas fa-edit"></i>
                </button>
                <h3 className="text-xl font-bold text-ink-black mb-4 flex items-center gap-2">
                    <i className="fas fa-route text-blue-500"></i> 迁徙记录
                </h3>
                <div className="text-gray-600 leading-relaxed text-sm">
                    {family.migration ? (
                        family.migration.split('\n').filter(l => l.trim()).map((line, i) => (
                             <div key={i} className="flex gap-2 mb-2">
                                <span className="text-blue-300 mt-1"><i className="fas fa-map-pin text-xs"></i></span>
                                <span>{line}</span>
                             </div>
                        ))
                    ) : (
                         <span className="text-gray-400">暂无迁徙记录</span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">快捷操作</h3>
                <div className="space-y-3">
                    <button 
                        onClick={() => navigate(`/tree?familyId=${family.id}`)}
                        className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 text-china-red rounded transition-colors"
                    >
                        <span className="font-bold"><i className="fas fa-sitemap mr-2"></i>查看世系图</span>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <button 
                        onClick={() => navigate(`/members?familyId=${family.id}`)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded transition-colors"
                    >
                        <span className="font-bold"><i className="fas fa-users mr-2"></i>管理成员</span>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>

        {/* Right Column: Zibei & Events */}
        <div className="space-y-6 lg:col-span-2">
            
            {/* Zibei / Generation Poem */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] relative group">
                <button 
                    onClick={() => openEditModal('culture')}
                    className="absolute top-4 right-4 text-gray-400 hover:text-china-red opacity-0 group-hover:opacity-100 transition-opacity"
                    title="编辑字辈"
                >
                    <i className="fas fa-edit"></i>
                </button>
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-ink-black flex items-center gap-2">
                        <i className="fas fa-align-vertical-top text-china-red"></i> 字辈 / 派语
                    </h3>
                </div>
                {family.zibei ? (
                    <div className="flex flex-wrap gap-6 justify-center py-4">
                        {family.zibei.split(/[\n,，。]/).filter(s => s.trim()).map((phrase, idx) => (
                            <div key={idx} className="writing-vertical-rl text-lg font-serif tracking-widest border-r border-red-200 pr-4 h-48 text-gray-800 hover:text-china-red transition-colors cursor-default">
                                {phrase}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded">暂无字辈记录</div>
                )}
            </div>

            {/* Major Events Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6 relative group">
                <button 
                    onClick={() => openEditModal('events')}
                    className="absolute top-6 right-6 text-gray-400 hover:text-noble-gold opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                    title="管理大事记"
                >
                    <i className="fas fa-edit"></i>
                </button>
                <h3 className="text-xl font-bold text-ink-black mb-6 flex items-center gap-2">
                    <i className="fas fa-history text-noble-gold"></i> 家族大事记
                </h3>
                
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4 min-h-[100px]">
                    {family.events && family.events.length > 0 ? (
                        family.events.map((event, idx) => (
                            <div key={idx} className="relative pl-8 group/event">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-china-red group-hover/event:scale-125 transition-transform"></span>
                                <span className="text-sm font-bold text-china-red bg-red-50 px-2 py-0.5 rounded mb-1 inline-block">
                                    {event.year}
                                </span>
                                <h4 className="text-lg font-bold text-gray-800">{event.title}</h4>
                                <p className="text-gray-600 mt-1">{event.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="pl-8 pt-2 text-gray-400">
                            暂无大事记，点击右上角图标添加。
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Editing Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}>
            <div 
                className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                    <div className="flex gap-4">
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'culture' ? 'bg-china-red text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('culture')}
                        >
                            <i className="fas fa-book mr-2"></i>家族文书
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-china-red text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('events')}
                        >
                            <i className="fas fa-history mr-2"></i>大事记管理
                        </button>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'culture' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">字辈 / 派语</label>
                                <div className="text-xs text-gray-400 mb-2">可输入多行，每一行或每一个标点将作为一段显示。</div>
                                <textarea 
                                    className="w-full border border-gray-300 rounded p-3 h-32 focus:ring-2 focus:ring-china-red focus:border-china-red outline-none"
                                    value={editForm.zibei || ''}
                                    onChange={(e) => setEditForm({...editForm, zibei: e.target.value})}
                                    placeholder="输入字辈..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">家训 / 祖训</label>
                                <div className="text-xs text-gray-400 mb-2">建议分段落输入，每一段占据一行。</div>
                                <textarea 
                                    className="w-full border border-gray-300 rounded p-3 h-32 focus:ring-2 focus:ring-china-red focus:border-china-red outline-none"
                                    value={editForm.motto || ''}
                                    onChange={(e) => setEditForm({...editForm, motto: e.target.value})}
                                    placeholder="输入家训..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">迁徙记录</label>
                                <div className="text-xs text-gray-400 mb-2">每一行记录一次迁徙路径。</div>
                                <textarea 
                                    className="w-full border border-gray-300 rounded p-3 h-32 focus:ring-2 focus:ring-china-red focus:border-china-red outline-none"
                                    value={editForm.migration || ''}
                                    onChange={(e) => setEditForm({...editForm, migration: e.target.value})}
                                    placeholder="如：唐末，由河南固始入闽..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-bold text-gray-700">事件列表</label>
                                <button 
                                    onClick={addEvent}
                                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-bold"
                                >
                                    <i className="fas fa-plus mr-1"></i>添加新事件
                                </button>
                            </div>
                            
                            {(!editForm.events || editForm.events.length === 0) && (
                                <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-400">
                                    暂无大事记，点击上方按钮添加。
                                </div>
                            )}

                            {editForm.events?.map((event, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group animate-[fadeIn_0.3s]">
                                    <button 
                                        onClick={() => removeEvent(idx)}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="删除此条"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">年份/时期</label>
                                            <input 
                                                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-china-red outline-none"
                                                placeholder="如: 1368年"
                                                value={event.year}
                                                onChange={(e) => handleEventChange(idx, 'year', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">事件标题</label>
                                            <input 
                                                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-china-red outline-none font-bold"
                                                placeholder="事件概要"
                                                value={event.title}
                                                onChange={(e) => handleEventChange(idx, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">详细描述</label>
                                            <textarea 
                                                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-china-red outline-none h-16"
                                                placeholder="事件的详细经过..."
                                                value={event.description}
                                                onChange={(e) => handleEventChange(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t p-4 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-6 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-china-red text-white rounded hover:bg-red-700 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        <i className="fas fa-save mr-2"></i>保存修改
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
