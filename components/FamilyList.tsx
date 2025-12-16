
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Family, Surname, FamilyEvent } from '../types';

export const FamilyList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSurnameId = searchParams.get('surnameId');

  const [families, setFamilies] = useState<Family[]>([]);
  const [surnames, setSurnames] = useState<Surname[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  
  // Form State
  const [familyForm, setFamilyForm] = useState<Partial<Family>>({ events: [] });
  const [selectedSurname, setSelectedSurname] = useState<Surname | undefined>(undefined);
  
  // Searchable Select State
  const [surnameSearchTerm, setSurnameSearchTerm] = useState('');
  const [showSurnameOptions, setShowSurnameOptions] = useState(false);
  
  // Filter State
  const [filterSurnameId, setFilterSurnameId] = useState<string>(initialSurnameId || '');

  // Helper state for adding events in modal
  const [newEvent, setNewEvent] = useState<FamilyEvent>({ year: '', title: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFamilies(DataService.getFamilies());
    setSurnames(DataService.getSurnames());
  };

  const handleOpenModal = (family?: Family) => {
    setShowSurnameOptions(false);
    setNewEvent({ year: '', title: '', description: '' });

    if (family) {
      setEditingFamily(family);
      setFamilyForm(JSON.parse(JSON.stringify(family))); // Deep copy
      const s = surnames.find(s => s.id === family.surnameId);
      setSelectedSurname(s);
      setSurnameSearchTerm(s?.name || '');
    } else {
      setEditingFamily(null);
      setFamilyForm({ name: '', origin: '', description: '', founder: '', events: [] });
      setSelectedSurname(undefined);
      setSurnameSearchTerm('');
    }
    setIsModalOpen(true);
  };

  const handleSurnameSelect = (surname: Surname) => {
    setSelectedSurname(surname);
    setFamilyForm({ ...familyForm, surnameId: surname.id, tanghaoId: '' });
    setSurnameSearchTerm(surname.name);
    setShowSurnameOptions(false);
  };

  const addEvent = () => {
    if (newEvent.year && newEvent.title) {
        const updatedEvents = [...(familyForm.events || []), newEvent];
        setFamilyForm({ ...familyForm, events: updatedEvents });
        setNewEvent({ year: '', title: '', description: '' });
    }
  };

  const removeEvent = (index: number) => {
      const updatedEvents = [...(familyForm.events || [])];
      updatedEvents.splice(index, 1);
      setFamilyForm({ ...familyForm, events: updatedEvents });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyForm.name || !familyForm.surnameId) return;

    const familyToSave: Family = {
      id: editingFamily ? editingFamily.id : DataService.generateId('f'),
      name: familyForm.name!,
      surnameId: familyForm.surnameId!,
      tanghaoId: familyForm.tanghaoId || '',
      founder: familyForm.founder || '',
      origin: familyForm.origin || '',
      description: familyForm.description || '',
      creatorId: 'admin',
      zibei: familyForm.zibei || '',
      motto: familyForm.motto || '',
      migration: familyForm.migration || '',
      events: familyForm.events || []
    };

    DataService.saveFamily(familyToSave);
    loadData();
    setIsModalOpen(false);
  };

  const getSurnameName = (id: string) => surnames.find(s => s.id === id)?.name || '未知';
  const getTanghaoName = (sid: string, tid: string) => {
    const s = surnames.find(s => s.id === sid);
    return s?.tanghao.find(t => t.id === tid)?.name || '-';
  };

  const filteredFamilies = families.filter(f => {
      if (filterSurnameId) return f.surnameId === filterSurnameId;
      return true;
  });

  const filteredSurnameOptions = surnames.filter(s => 
    s.name.toLowerCase().includes(surnameSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold border-l-8 border-china-red pl-4">家族管理</h2>
        <div className="flex gap-4 items-center">
            {filterSurnameId && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                    筛选: {getSurnameName(filterSurnameId)}姓
                    <button onClick={() => setFilterSurnameId('')} className="ml-2 hover:text-red-600"><i className="fas fa-times"></i></button>
                </div>
            )}
            <button
            onClick={() => handleOpenModal()}
            className="bg-china-red text-white px-4 py-2 rounded hover:bg-red-700 whitespace-nowrap"
            >
            <i className="fas fa-plus mr-2"></i>创建家族
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFamilies.map(family => (
          <div key={family.id} className="bg-white rounded-xl shadow-md p-6 relative border-t-4 border-noble-gold flex flex-col">
            <div className="absolute top-4 right-4 space-x-2">
              <button onClick={() => handleOpenModal(family)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
              <button onClick={() => {
                  if(window.confirm('确定删除该家族及其所有成员吗？此操作不可恢复。')) {
                    DataService.deleteFamily(family.id);
                    loadData();
                  }
              }} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
            </div>
            
            <h3 className="text-2xl font-bold text-ink-black mb-1 cursor-pointer hover:text-china-red" onClick={() => navigate(`/family/${family.id}`)}>
                {family.name}
            </h3>
            <div className="flex gap-2 text-sm mb-4">
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">{getSurnameName(family.surnameId)}姓</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{getTanghaoName(family.surnameId, family.tanghaoId)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 flex-1">
               <div><span className="font-bold">始祖:</span> {family.founder}</div>
               <div><span className="font-bold">发源:</span> {family.origin}</div>
            </div>
            <p className="mt-4 text-gray-500 text-sm line-clamp-2 mb-6">{family.description}</p>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-auto pt-4 border-t">
                <button 
                    onClick={() => navigate(`/family/${family.id}`)}
                    className="flex-1 bg-china-red text-white py-2 rounded hover:bg-red-700 text-sm font-bold"
                >
                    <i className="fas fa-book-open mr-2"></i>详情/家训
                </button>
                <button 
                    onClick={() => navigate(`/tree?familyId=${family.id}`)}
                    className="flex-1 bg-ink-black text-white py-2 rounded hover:bg-gray-700 text-sm"
                >
                    <i className="fas fa-project-diagram mr-2"></i>世系图
                </button>
                 <button 
                    onClick={() => navigate(`/members?familyId=${family.id}`)}
                    className="w-10 bg-gray-100 text-gray-600 py-2 rounded hover:bg-gray-200 text-sm flex items-center justify-center"
                    title="成员管理"
                >
                    <i className="fas fa-users"></i>
                </button>
            </div>
          </div>
        ))}
        {families.length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">暂无家族数据，请先创建家族。</p>}
        {families.length > 0 && filteredFamilies.length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">未找到该姓氏的家族。</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold">{editingFamily ? '编辑家族' : '创建家族'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-bold mb-1">选择姓氏 <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        placeholder="输入姓氏搜索 (如: 张)"
                        className="w-full border p-2 rounded focus:border-china-red outline-none"
                        value={surnameSearchTerm}
                        onChange={(e) => {
                            setSurnameSearchTerm(e.target.value);
                            setShowSurnameOptions(true);
                            if (familyForm.surnameId) {
                                setFamilyForm({ ...familyForm, surnameId: '' });
                                setSelectedSurname(undefined);
                            }
                        }}
                        onFocus={() => setShowSurnameOptions(true)}
                        onBlur={() => setTimeout(() => setShowSurnameOptions(false), 200)} 
                    />
                    {showSurnameOptions && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto shadow-lg rounded">
                            {filteredSurnameOptions.map(s => (
                                <div key={s.id} className="p-2 hover:bg-red-50 cursor-pointer text-sm" onClick={() => handleSurnameSelect(s)}>
                                    {s.name}
                                </div>
                            ))}
                        </div>
                    )}
                  </div>

                  {selectedSurname && (
                    <div>
                      <label className="block text-sm font-bold mb-1">选择堂号</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={familyForm.tanghaoId || ''}
                        onChange={e => setFamilyForm({ ...familyForm, tanghaoId: e.target.value })}
                      >
                        <option value="">无 / 其他</option>
                        {selectedSurname.tanghao.map(t => <option key={t.id} value={t.id}>{t.name} ({t.region})</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold mb-1">家族名称 <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="如: 清河张氏" className="w-full border p-2 rounded" value={familyForm.name} onChange={e => setFamilyForm({ ...familyForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">始祖</label>
                    <input type="text" className="w-full border p-2 rounded" value={familyForm.founder} onChange={e => setFamilyForm({ ...familyForm, founder: e.target.value })} />
                  </div>
                   <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">发源地</label>
                    <input type="text" className="w-full border p-2 rounded" value={familyForm.origin} onChange={e => setFamilyForm({ ...familyForm, origin: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">简介</label>
                    <textarea className="w-full border p-2 rounded h-20" value={familyForm.description} onChange={e => setFamilyForm({ ...familyForm, description: e.target.value })} />
                  </div>
              </div>

              {/* Extended Info Section */}
              <div className="border-t pt-4 space-y-4">
                  <h4 className="font-bold text-lg text-ink-black">详细信息</h4>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1">字辈 / 派语</label>
                    <textarea 
                        className="w-full border p-2 rounded h-20 placeholder-gray-400" 
                        placeholder="如: 金水木土火，世德永流传..."
                        value={familyForm.zibei || ''} 
                        onChange={e => setFamilyForm({ ...familyForm, zibei: e.target.value })} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">家训 / 祖训</label>
                    <textarea 
                        className="w-full border p-2 rounded h-24 placeholder-gray-400" 
                        placeholder="家族传承的教诲..."
                        value={familyForm.motto || ''} 
                        onChange={e => setFamilyForm({ ...familyForm, motto: e.target.value })} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">迁徙记录</label>
                    <textarea 
                        className="w-full border p-2 rounded h-20 placeholder-gray-400" 
                        placeholder="记录家族的迁徙历史..."
                        value={familyForm.migration || ''} 
                        onChange={e => setFamilyForm({ ...familyForm, migration: e.target.value })} 
                    />
                  </div>
                  
                  {/* Events Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-bold mb-2">家族大事记</label>
                      <div className="space-y-2 mb-3">
                          {familyForm.events?.map((ev, idx) => (
                              <div key={idx} className="flex items-start gap-2 bg-white p-2 border rounded text-sm">
                                  <span className="font-bold text-china-red whitespace-nowrap">{ev.year}</span>
                                  <div className="flex-1">
                                      <div className="font-bold">{ev.title}</div>
                                      <div className="text-gray-500 text-xs">{ev.description}</div>
                                  </div>
                                  <button type="button" onClick={() => removeEvent(idx)} className="text-red-400 hover:text-red-600"><i className="fas fa-times"></i></button>
                              </div>
                          ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                          <div className="md:col-span-1">
                              <input placeholder="年份" className="w-full border p-1 rounded text-sm" value={newEvent.year} onChange={e => setNewEvent({...newEvent, year: e.target.value})} />
                          </div>
                          <div className="md:col-span-2">
                              <input placeholder="事件标题" className="w-full border p-1 rounded text-sm" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                          </div>
                           <div className="md:col-span-2">
                              <input placeholder="详细描述" className="w-full border p-1 rounded text-sm" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                          </div>
                          <button type="button" onClick={addEvent} className="bg-gray-200 hover:bg-china-red hover:text-white px-3 py-1.5 rounded text-sm transition-colors">添加</button>
                      </div>
                  </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 mr-2">取消</button>
                <button type="submit" className="px-6 py-2 bg-china-red text-white rounded hover:bg-red-700 font-bold">保存信息</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
