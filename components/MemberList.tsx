import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Member, Family, Gender } from '../types';

export const MemberList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFamilyId = searchParams.get('familyId');

  const [members, setMembers] = useState<Member[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [filterFamily, setFilterFamily] = useState<string>(initialFamilyId || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<Partial<Member>>({ spouseIds: [] });

  // Search states for relationship inputs
  const [searchFather, setSearchFather] = useState('');
  const [searchMother, setSearchMother] = useState('');
  const [searchSpouse, setSearchSpouse] = useState('');
  const [spouseToAdd, setSpouseToAdd] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMembers(DataService.getMembers());
    setFamilies(DataService.getFamilies());
  };

  const handleOpenModal = (member?: Member) => {
    setSearchFather('');
    setSearchMother('');
    setSearchSpouse('');
    setSpouseToAdd('');
    
    if (member) {
      setEditingMember(member);
      setForm({ ...member });
    } else {
      setEditingMember(null);
      // Pre-select family if filtered
      const defaultFamilyId = filterFamily !== 'all' ? filterFamily : (families.length > 0 ? families[0].id : '');
      
      setForm({ 
        gender: Gender.Male, 
        generation: 1, 
        spouseIds: [],
        fatherId: '',
        motherId: '',
        familyId: defaultFamilyId
      });
    }
    setIsModalOpen(true);
  };

  const handleFamilyChange = (newFamilyId: string) => {
    // When family changes, we must reset relationships that depend on family scope
    // Father must be in same family, so clear it
    // Mother and Spouses must be external, so strictly we should check if they are now internal,
    // but for simplicity we just clear Father to avoid immediate "Impossible Data" states.
    setForm(prev => ({
        ...prev,
        familyId: newFamilyId,
        fatherId: '', 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.familyId) return;

    const memberToSave: Member = {
      id: editingMember ? editingMember.id : DataService.generateId('m'),
      familyId: form.familyId!,
      name: form.name!,
      gender: form.gender || Gender.Male,
      generation: Number(form.generation) || 1,
      fatherId: form.fatherId || null,
      motherId: form.motherId || null,
      spouseIds: form.spouseIds || [],
      birthDate: form.birthDate || '',
      deathDate: form.deathDate || '',
      bio: form.bio || '',
      photo: form.photo || `https://picsum.photos/100/100?random=${Math.random()}`
    };

    DataService.saveMember(memberToSave);
    loadData();
    setIsModalOpen(false);
  };

  const getFamilyName = (id: string) => families.find(f => f.id === id)?.name || '未知家族';
  const getMemberName = (id?: string | null) => members.find(m => m.id === id)?.name || '-';

  // Relationship filtering logic
  
  // Father: Male, Same Family
  const getPotentialFathers = () => {
    if (!form.familyId) return [];
    return members.filter(m => 
      m.familyId === form.familyId && 
      m.gender === Gender.Male && 
      m.id !== form.id &&
      (searchFather === '' || m.name.toLowerCase().includes(searchFather.toLowerCase()))
    );
  };
  
  // Mother: Female, DIFFERENT Family (External)
  const getPotentialMothers = () => {
    return members.filter(m => 
      m.familyId !== form.familyId && // External
      m.gender === Gender.Female && 
      m.id !== form.id &&
      (searchMother === '' || m.name.toLowerCase().includes(searchMother.toLowerCase()))
    );
  };

  // Spouse: DIFFERENT Family (External), Not already added
  const getPotentialSpousesToAdd = () => {
    return members.filter(m => 
      m.familyId !== form.familyId && // External
      m.id !== form.id && 
      !form.spouseIds?.includes(m.id) &&
      (searchSpouse === '' || m.name.toLowerCase().includes(searchSpouse.toLowerCase()))
    );
  };

  const addSpouse = () => {
    if (spouseToAdd && !form.spouseIds?.includes(spouseToAdd)) {
      setForm({
        ...form,
        spouseIds: [...(form.spouseIds || []), spouseToAdd]
      });
      setSpouseToAdd('');
    }
  };

  const removeSpouse = (idToRemove: string) => {
    setForm({
      ...form,
      spouseIds: form.spouseIds?.filter(id => id !== idToRemove) || []
    });
  };

  const filteredMembers = members.filter(m => {
    const matchFamily = filterFamily === 'all' || m.familyId === filterFamily;
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFamily && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold border-l-8 border-china-red pl-4">成员管理</h2>
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <select 
            className="border p-2 rounded outline-none"
            value={filterFamily}
            onChange={e => setFilterFamily(e.target.value)}
          >
            <option value="all">所有家族</option>
            {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <input 
            placeholder="搜索姓名..." 
            className="border p-2 rounded outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button onClick={() => handleOpenModal()} className="bg-china-red text-white px-4 py-2 rounded whitespace-nowrap">
            <i className="fas fa-user-plus mr-2"></i>录入
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">姓名 / 家族</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">性别 / 世代</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">生卒年</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">父亲 / 母亲</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-5 py-5 text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img className="w-full h-full rounded-full border border-gray-300" src={member.photo} alt="" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-bold whitespace-no-wrap">{member.name}</p>
                      <p className="text-gray-500 text-xs">{getFamilyName(member.familyId)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {member.gender === Gender.Male ? <i className="fas fa-mars text-blue-500 mr-1"></i> : <i className="fas fa-venus text-pink-500 mr-1"></i>}
                    {member.gender === Gender.Male ? '男' : '女'}
                  </p>
                  <p className="text-gray-500 text-xs">第 {member.generation} 代</p>
                </td>
                <td className="px-5 py-5 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{member.birthDate}</p>
                  {member.deathDate && <p className="text-gray-500 text-xs">卒: {member.deathDate}</p>}
                </td>
                <td className="px-5 py-5 text-sm text-gray-500">
                  <p>父: {getMemberName(member.fatherId)}</p>
                  <p>母: {getMemberName(member.motherId)}</p>
                </td>
                <td className="px-5 py-5 text-sm text-right">
                  <button onClick={() => handleOpenModal(member)} className="text-blue-600 hover:text-blue-900 mr-3"><i className="fas fa-edit"></i></button>
                  <button onClick={() => {
                      if(window.confirm('删除成员会断开所有亲属连接，确定吗？')) {
                        DataService.deleteMember(member.id);
                        loadData();
                      }
                  }} className="text-red-600 hover:text-red-900"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && <div className="p-10 text-center text-gray-500">未找到匹配成员</div>}
      </div>

      {isModalOpen && form && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
         <div 
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all scale-100" 
            onClick={e => e.stopPropagation()}
         >
           {/* Modal Header */}
           <div className="bg-china-red text-white p-6 sticky top-0 z-10 flex justify-between items-center shadow-md">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                 <i className={`fas ${editingMember ? 'fa-user-edit' : 'fa-user-plus'}`}></i>
                 {editingMember ? '编辑成员' : '录入成员'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-xl"
              >
                  <i className="fas fa-times"></i>
              </button>
           </div>

           <form onSubmit={handleSubmit} className="p-8 space-y-8">
             {/* Basic Info */}
             <div>
                <h4 className="font-bold text-gray-800 border-l-4 border-china-red pl-2 mb-4 text-lg">基本信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">所属家族 <span className="text-red-500">*</span></label>
                        <select 
                            required
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all bg-gray-50"
                            value={form.familyId}
                            onChange={e => handleFamilyChange(e.target.value)}
                        >
                            <option value="">请选择</option>
                            {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">姓名 <span className="text-red-500">*</span></label>
                        <input 
                            required 
                            type="text" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">性别</label>
                        <select 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                            value={form.gender} 
                            onChange={e => setForm({...form, gender: e.target.value as Gender})}
                        >
                            <option value={Gender.Male}>男</option>
                            <option value={Gender.Female}>女</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">世代 (第几代)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                            value={form.generation} 
                            onChange={e => setForm({...form, generation: parseInt(e.target.value)})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">出生日期</label>
                        <input 
                            type="date" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                            value={form.birthDate} 
                            onChange={e => setForm({...form, birthDate: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-600">去世日期 (可选)</label>
                        <input 
                            type="date" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                            value={form.deathDate || ''} 
                            onChange={e => setForm({...form, deathDate: e.target.value})} 
                        />
                    </div>
                </div>
             </div>

             {/* Relationships */}
             <div className="border-t pt-6">
                <h4 className="font-bold text-gray-800 border-l-4 border-china-red pl-2 mb-4 text-lg">家庭关系</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                   {/* Father Selection */}
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                     <label className="block text-sm font-bold mb-2 text-ink-black flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        父亲 (本家族男性)
                     </label>
                     <input 
                        type="text" 
                        placeholder="输入名字搜索..." 
                        className="w-full border border-gray-300 p-2 rounded mb-2 text-sm focus:border-china-red outline-none"
                        value={searchFather}
                        onChange={e => setSearchFather(e.target.value)}
                     />
                     <select 
                        className="w-full border border-gray-300 p-2 rounded bg-white" 
                        value={form.fatherId || ''} 
                        onChange={e => setForm({...form, fatherId: e.target.value || null})}
                        disabled={!form.familyId}
                     >
                       <option value="">无 / 未知</option>
                       {form.fatherId && !getPotentialFathers().find(m => m.id === form.fatherId) && (
                         <option value={form.fatherId}>{getMemberName(form.fatherId)} (已选)</option>
                       )}
                       {getPotentialFathers().map(m => <option key={m.id} value={m.id}>{m.name} (第{m.generation}代)</option>)}
                     </select>
                     {form.familyId && <p className="text-xs text-gray-500 mt-2">仅显示 {getFamilyName(form.familyId)} 的男性成员</p>}
                   </div>

                   {/* Mother Selection */}
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-pink-300 transition-colors">
                     <label className="block text-sm font-bold mb-2 text-ink-black flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                        母亲 (外家族女性)
                     </label>
                     <input 
                        type="text" 
                        placeholder="输入名字搜索..." 
                        className="w-full border border-gray-300 p-2 rounded mb-2 text-sm focus:border-china-red outline-none"
                        value={searchMother}
                        onChange={e => setSearchMother(e.target.value)}
                     />
                     <select 
                        className="w-full border border-gray-300 p-2 rounded bg-white" 
                        value={form.motherId || ''} 
                        onChange={e => setForm({...form, motherId: e.target.value || null})}
                        disabled={!form.familyId}
                     >
                       <option value="">无 / 未知</option>
                       {form.motherId && !getPotentialMothers().find(m => m.id === form.motherId) && (
                         <option value={form.motherId}>{getMemberName(form.motherId)} (已选)</option>
                       )}
                       {getPotentialMothers().map(m => <option key={m.id} value={m.id}>{m.name} ({getFamilyName(m.familyId)})</option>)}
                     </select>
                     <p className="text-xs text-gray-500 mt-2">仅显示非本家族的女性成员</p>
                   </div>
                   
                   {/* Spouse Selection */}
                   <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
                      <label className="block text-sm font-bold mb-3 text-ink-black flex items-center">
                         <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                         配偶 (外家族成员, 可多选)
                      </label>
                      
                      {/* List of added spouses */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {form.spouseIds?.map(id => (
                          <div key={id} className="bg-white border border-china-red text-china-red px-3 py-1 rounded-full flex items-center shadow-sm">
                            <span className="text-sm font-bold mr-2">{getMemberName(id)} ({getFamilyName(members.find(m => m.id === id)?.familyId || '')})</span>
                            <button type="button" onClick={() => removeSpouse(id)} className="hover:text-red-800 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"><i className="fas fa-times"></i></button>
                          </div>
                        ))}
                        {(!form.spouseIds || form.spouseIds.length === 0) && <span className="text-sm text-gray-400 italic bg-white px-3 py-1 rounded border border-dashed border-gray-300">暂无配偶</span>}
                      </div>

                      {/* Add Spouse Controls */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input 
                              type="text" 
                              placeholder="搜索外族成员..." 
                              className="w-full border border-gray-300 p-2 rounded-t text-sm border-b-0 focus:border-china-red outline-none focus:relative z-10"
                              value={searchSpouse}
                              onChange={e => setSearchSpouse(e.target.value)}
                           />
                           <select 
                              className="w-full border border-gray-300 p-2 rounded-b bg-white focus:border-china-red outline-none"
                              value={spouseToAdd}
                              onChange={e => setSpouseToAdd(e.target.value)}
                              disabled={!form.familyId}
                           >
                             <option value="">选择要添加的配偶...</option>
                             {getPotentialSpousesToAdd().map(m => (
                               <option key={m.id} value={m.id}>
                                 {m.name} ({getFamilyName(m.familyId)}) - {m.gender === Gender.Male ? '男' : '女'}
                               </option>
                             ))}
                           </select>
                        </div>
                        <button 
                          type="button" 
                          onClick={addSpouse}
                          disabled={!spouseToAdd}
                          className={`px-6 rounded-lg font-bold transition-colors ${spouseToAdd ? 'bg-china-red text-white hover:bg-red-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          <i className="fas fa-plus mr-1"></i> 添加
                        </button>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="border-t pt-6">
                <h4 className="font-bold text-gray-800 border-l-4 border-china-red pl-2 mb-4 text-lg">生平简介</h4>
                <textarea 
                    className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-2 focus:ring-china-red focus:border-china-red outline-none transition-all" 
                    value={form.bio} 
                    onChange={e => setForm({...form, bio: e.target.value})} 
                    placeholder="记录成员的生平事迹..."
                />
             </div>

             <div className="flex justify-end pt-4 gap-4">
               <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
               >
                取消
               </button>
               <button 
                type="submit" 
                className="px-8 py-2.5 bg-china-red text-white font-bold rounded-lg hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
               >
                <i className="fas fa-save mr-2"></i>保存成员信息
               </button>
             </div>
           </form>
         </div>
         </div>
      )}
    </div>
  );
};
