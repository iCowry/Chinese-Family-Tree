
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SurnameList } from './components/SurnameList';
import { FamilyList } from './components/FamilyList';
import { MemberList } from './components/MemberList';
import { GenealogyTree } from './components/GenealogyTree';
import { FamilyDetail } from './components/FamilyDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/surnames" element={<SurnameList />} />
          <Route path="/families" element={<FamilyList />} />
          <Route path="/family/:id" element={<FamilyDetail />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/tree" element={<GenealogyTree />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
