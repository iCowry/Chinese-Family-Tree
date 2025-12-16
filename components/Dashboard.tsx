import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { AppData } from '../types';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData({
      surnames: DataService.getSurnames(),
      families: DataService.getFamilies(),
      members: DataService.getMembers(),
    });
  }, []);

  if (!data) return <div>加载中...</div>;

  const stats = [
    { label: '收录姓氏', value: data.surnames.length, icon: 'fas fa-book', color: 'bg-blue-500' },
    { label: '家族总数', value: data.families.length, icon: 'fas fa-users', color: 'bg-green-500' },
    { label: '总人数', value: data.members.length, icon: 'fas fa-user-friends', color: 'bg-china-red' },
    { label: '在世成员', value: data.members.filter(m => !m.deathDate).length, icon: 'fas fa-heart', color: 'bg-noble-gold' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-ink-black border-l-8 border-china-red pl-4">系统概览</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200">
            <div className={`${stat.color} text-white p-4 rounded-full text-xl w-12 h-12 flex items-center justify-center`}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-ink-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
             <h3 className="text-xl font-bold">最近收录家族</h3>
             <Link to="/families" className="text-xs text-gray-500 hover:text-china-red">查看全部 <i className="fas fa-angle-right"></i></Link>
          </div>
          <ul className="space-y-2">
            {[...data.families].reverse().slice(0, 5).map(f => (
              <li key={f.id} className="hover:bg-red-50/50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                <Link 
                  to={`/tree?familyId=${f.id}`} 
                  className="flex justify-between items-center p-3 w-full group"
                  title="点击查看世系图"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-china-red flex items-center justify-center border-2 border-red-50 group-hover:border-china-red group-hover:bg-china-red group-hover:text-white transition-all shadow-sm">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-800 group-hover:text-china-red transition-colors truncate text-base">{f.name}</span>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                             {f.founder && (
                                <span className="flex items-center truncate max-w-[80px]" title={`始祖: ${f.founder}`}>
                                    <i className="fas fa-user-tag mr-1 opacity-70 text-xs"></i>{f.founder}
                                </span>
                             )}
                             <span className="flex items-center truncate max-w-[100px]" title={`发源地: ${f.origin}`}>
                                <i className="fas fa-map-marker-alt mr-1 opacity-70 text-xs"></i>{f.origin}
                             </span>
                        </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                      <i className="fas fa-chevron-right text-gray-300 group-hover:text-china-red transition-colors transform group-hover:translate-x-1"></i>
                  </div>
                </Link>
              </li>
            ))}
            {data.families.length === 0 && <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-lg">暂无数据</p>}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
           <h3 className="text-xl font-bold mb-4 border-b pb-2">功能快捷入口</h3>
           <div className="grid grid-cols-2 gap-4">
              <Link to="/surnames" className="p-5 bg-gray-50 hover:bg-red-50 rounded-xl text-center border border-gray-100 hover:border-china-red transition-all group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-china-red shadow-sm group-hover:scale-110 transition-transform">
                     <i className="fas fa-book text-xl"></i>
                </div>
                <div className="font-bold text-gray-800 group-hover:text-china-red transition-colors">添加姓氏</div>
                <div className="text-xs text-gray-400 mt-1">管理姓氏、郡望与堂号</div>
              </Link>
              <Link to="/families" className="p-5 bg-gray-50 hover:bg-red-50 rounded-xl text-center border border-gray-100 hover:border-china-red transition-all group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-china-red shadow-sm group-hover:scale-110 transition-transform">
                     <i className="fas fa-users text-xl"></i>
                </div>
                <div className="font-bold text-gray-800 group-hover:text-china-red transition-colors">创建家族</div>
                <div className="text-xs text-gray-400 mt-1">建立新的家族支系</div>
              </Link>
              <Link to="/members" className="p-5 bg-gray-50 hover:bg-red-50 rounded-xl text-center border border-gray-100 hover:border-china-red transition-all group shadow-sm hover:shadow-md">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-china-red shadow-sm group-hover:scale-110 transition-transform">
                     <i className="fas fa-user-plus text-xl"></i>
                </div>
                 <div className="font-bold text-gray-800 group-hover:text-china-red transition-colors">录入成员</div>
                 <div className="text-xs text-gray-400 mt-1">维护家族成员信息</div>
              </Link>
              <Link to="/tree" className="p-5 bg-gray-50 hover:bg-red-50 rounded-xl text-center border border-gray-100 hover:border-china-red transition-all group shadow-sm hover:shadow-md">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-china-red shadow-sm group-hover:scale-110 transition-transform">
                     <i className="fas fa-sitemap text-xl"></i>
                </div>
                 <div className="font-bold text-gray-800 group-hover:text-china-red transition-colors">查看世系</div>
                 <div className="text-xs text-gray-400 mt-1">可视化浏览家族树</div>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};