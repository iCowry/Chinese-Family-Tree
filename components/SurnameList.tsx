import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Surname, Tanghao } from '../types';

export const SurnameList: React.FC = () => {
  const navigate = useNavigate();
  const [surnames, setSurnames] = useState<Surname[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurname, setEditingSurname] = useState<Surname | null>(null);
  const [formData, setFormData] = useState<Partial<Surname>>({ name: '', origin: '', junwangs: [], tanghao: [] });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    loadSurnames();
  }, []);

  useEffect(() => {
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, [searchTerm]);

  const loadSurnames = () => {
    setSurnames(DataService.getSurnames());
  };

  const handleOpenModal = (surname?: Surname) => {
    if (surname) {
      setEditingSurname(surname);
      setFormData(JSON.parse(JSON.stringify(surname))); // Deep copy
    } else {
      setEditingSurname(null);
      setFormData({ name: '', origin: '', junwangs: [], tanghao: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const surnameToSave: Surname = {
      id: editingSurname ? editingSurname.id : DataService.generateId('s'),
      name: formData.name!,
      origin: formData.origin || '',
      junwangs: formData.junwangs || [],
      tanghao: formData.tanghao || []
    };

    DataService.saveSurname(surnameToSave);
    loadSurnames();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个姓氏吗？关联的家族可能受到影响。')) {
      DataService.deleteSurname(id);
      loadSurnames();
    }
  };

  const addTanghao = () => {
    const newTanghao: Tanghao = {
      id: DataService.generateId('t'),
      name: '新堂号',
      region: '',
      year: '',
      origin: '',
      couplet: ''
    };
    setFormData({ ...formData, tanghao: [...(formData.tanghao || []), newTanghao] });
  };

  const updateTanghao = (index: number, field: keyof Tanghao, value: string) => {
    const newTanghaos = [...(formData.tanghao || [])];
    newTanghaos[index] = { ...newTanghaos[index], [field]: value };
    setFormData({ ...formData, tanghao: newTanghaos });
  };

  const removeTanghao = (index: number) => {
    const newTanghaos = [...(formData.tanghao || [])];
    newTanghaos.splice(index, 1);
    setFormData({ ...formData, tanghao: newTanghaos });
  };

  const filteredSurnames = surnames.filter(s => s.name.includes(searchTerm));
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredSurnames.length / itemsPerPage);
  const paginatedSurnames = filteredSurnames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold border-l-8 border-china-red pl-4">姓氏管理</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="搜索姓氏..."
            className="border p-2 rounded w-full md:w-64 focus:border-china-red outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-china-red text-white px-4 py-2 rounded hover:bg-red-700 whitespace-nowrap"
          >
            <i className="fas fa-plus mr-2"></i>添加姓氏
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSurnames.map(surname => (
          <div key={surname.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            <div className="bg-ink-black text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{surname.name}姓</h3>
              <div className="space-x-2">
                <button onClick={() => handleOpenModal(surname)} className="text-noble-gold hover:text-white"><i className="fas fa-edit"></i></button>
                <button onClick={() => handleDelete(surname.id)} className="text-red-400 hover:text-red-200"><i className="fas fa-trash"></i></button>
              </div>
            </div>
            <div className="p-4 space-y-4 flex-1">
              <div>
                <p className="text-sm font-bold text-gray-500">起源：</p>
                <p className="text-sm line-clamp-2">{surname.origin}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">堂号 ({surname.tanghao.length})：</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {surname.tanghao.slice(0, 3).map(t => (
                    <span key={t.id} className="px-2 py-1 bg-gray-100 text-xs rounded border border-gray-300">{t.name}</span>
                  ))}
                  {surname.tanghao.length > 3 && <span className="text-xs text-gray-400">...</span>}
                  {surname.tanghao.length === 0 && <span className="text-xs text-gray-400">暂无</span>}
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 border-t flex justify-end">
               <button 
                onClick={() => navigate(`/families?surnameId=${surname.id}`)}
                className="text-sm text-china-red font-bold hover:underline flex items-center"
               >
                 查看家族列表 <i className="fas fa-arrow-right ml-1"></i>
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredSurnames.length === 0 && (
          <div className="text-center py-10 text-gray-500">
              未找到相关姓氏
          </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border hover:border-china-red text-ink-black'}`}
          >
            上一页
          </button>
          <span className="text-gray-600">
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border hover:border-china-red text-ink-black'}`}
          >
            下一页
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">{editingSurname ? '编辑姓氏' : '添加姓氏'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">姓氏名称 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="w-full border p-2 rounded focus:border-china-red outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">起源说明</label>
                  <textarea
                    className="w-full border p-2 rounded focus:border-china-red outline-none h-24"
                    value={formData.origin}
                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
              </div>

              {/* Tanghao Management Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">堂号管理</h4>
                  <button type="button" onClick={addTanghao} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                    <i className="fas fa-plus mr-1"></i>添加堂号
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.tanghao?.map((t, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded border relative">
                       <button type="button" onClick={() => removeTanghao(idx)} className="absolute top-2 right-2 text-red-500"><i className="fas fa-times"></i></button>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <input
                            placeholder="堂号名 (如:清河堂)"
                            className="border p-1 rounded"
                            value={t.name}
                            onChange={e => updateTanghao(idx, 'name', e.target.value)}
                         />
                         <input
                            placeholder="地区"
                            className="border p-1 rounded"
                            value={t.region}
                            onChange={e => updateTanghao(idx, 'region', e.target.value)}
                         />
                          <input
                            placeholder="年代"
                            className="border p-1 rounded"
                            value={t.year}
                            onChange={e => updateTanghao(idx, 'year', e.target.value)}
                         />
                         <input
                            placeholder="由来"
                            className="border p-1 rounded md:col-span-3"
                            value={t.origin}
                            onChange={e => updateTanghao(idx, 'origin', e.target.value)}
                         />
                         <input
                            placeholder="堂联"
                            className="border p-1 rounded md:col-span-3"
                            value={t.couplet}
                            onChange={e => updateTanghao(idx, 'couplet', e.target.value)}
                         />
                       </div>
                    </div>
                  ))}
                  {(!formData.tanghao || formData.tanghao.length === 0) && <p className="text-sm text-gray-400">暂无堂号信息</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 mr-2">取消</button>
                <button type="submit" className="px-6 py-2 bg-china-red text-white rounded hover:bg-red-700">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};