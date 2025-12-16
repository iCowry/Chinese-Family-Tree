import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { DataService } from '../services/dataService';
import { Member, Family, Gender } from '../types';

export const GenealogyTree: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialFamilyId = searchParams.get('familyId');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  
  // Detail Modal State
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [relatedMembers, setRelatedMembers] = useState<{spouse?: Member[], father?: Member, mother?: Member}>({});

  useEffect(() => {
    const m = DataService.getMembers();
    const f = DataService.getFamilies();
    setMembers(m);
    setFamilies(f);
    
    if (initialFamilyId && f.find(family => family.id === initialFamilyId)) {
      setSelectedFamilyId(initialFamilyId);
    } else {
      const huang = f.find(family => family.name === '江夏黄氏');
      setSelectedFamilyId(huang ? huang.id : (f.length > 0 ? f[0].id : ''));
    }
  }, [initialFamilyId]);

  useEffect(() => {
    if (!selectedFamilyId || !svgRef.current || members.length === 0) return;
    renderTree();
  }, [selectedFamilyId, members]);

  useEffect(() => {
    if (viewingMember) {
      const spouse = members.filter(m => viewingMember.spouseIds.includes(m.id));
      const father = members.find(m => m.id === viewingMember.fatherId);
      const mother = members.find(m => m.id === viewingMember.motherId);
      setRelatedMembers({ spouse, father, mother });
    }
  }, [viewingMember, members]);

  const renderTree = () => {
    if(!svgRef.current || !wrapperRef.current) return;

    // 1. Data Prep
    const familyMembers = members.filter(m => m.familyId === selectedFamilyId);
    if(familyMembers.length === 0) {
        d3.select(svgRef.current).selectAll("*").remove();
        return;
    }

    const roots = familyMembers.filter(m => !m.fatherId || !familyMembers.find(fm => fm.id === m.fatherId));
    const rootMember = roots[0];

    const stratifyData = familyMembers.map(m => ({
        id: m.id,
        parentId: (m.fatherId && familyMembers.find(bm => bm.id === m.fatherId)) ? m.fatherId : null,
        data: m
    }));

    const descendants = new Set<string>();
    const queue = [rootMember.id];
    while(queue.length > 0) {
        const currentId = queue.shift()!;
        descendants.add(currentId);
        const children = stratifyData.filter(d => d.parentId === currentId);
        children.forEach(c => queue.push(c.id));
    }
    const cleanData = stratifyData.filter(d => descendants.has(d.id));

    if (cleanData.length === 0) return;

    const root = d3.stratify<any>()
        .id(d => d.id)
        .parentId(d => d.parentId)
        (cleanData);

    // 2. Layout Configuration
    const nodeWidth = 140;
    const nodeHeight = 70;
    const spouseVerticalGap = 40; // Gap between husband and wife row
    const spouseHorizontalGap = 20; // Gap between wives
    // Level Gap needs to cover: MainNode(70) + Gap(40) + SpouseNode(70) + LineToChild(50+)
    const levelGap = 260; 

    // Calculate width of the node group (Main + Spouses below) to ensure D3 separates trees enough
    const getNodeGroupWidth = (d: d3.HierarchyNode<any>) => {
        const member = d.data.data as Member;
        const spouseCount = member.spouseIds ? member.spouseIds.length : 0;
        if (spouseCount === 0) return nodeWidth;
        
        // Width of the row of spouses
        const spousesWidth = spouseCount * nodeWidth + (spouseCount - 1) * spouseHorizontalGap;
        // Return the larger of the two
        return Math.max(nodeWidth, spousesWidth);
    };

    const treeLayout = d3.tree<any>()
        .nodeSize([nodeWidth + 40, levelGap])
        .separation((a, b) => {
             const widthA = getNodeGroupWidth(a);
             const widthB = getNodeGroupWidth(b);
             // Factor calculates how many "nodeSizes" apart they should be
             return (widthA + widthB) / 2 / (nodeWidth + 40) + 0.5; 
        });

    treeLayout(root);

    // 3. Render
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    const bounds = wrapperRef.current.getBoundingClientRect();
    // Initial centering
    svg.call(zoom.transform, d3.zoomIdentity.translate(bounds.width / 2, 50).scale(0.8));

    // --- DRAW LINKS ---
    g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#CBD5E0")
        .attr("stroke-width", 2)
        .attr("d", (d: any) => {
            const sourceMember = d.source.data.data as Member;
            const targetMember = d.target.data.data as Member;
            
            // Default Source: Bottom of Main Member
            let sourceX = d.source.x;
            // Standard bottom of main node
            let sourceY = d.source.y + nodeHeight / 2; 

            // LOGIC CHANGE: If routing from spouse (Mother)
            if (targetMember.motherId && sourceMember.spouseIds) {
                const spouseIndex = sourceMember.spouseIds.indexOf(targetMember.motherId);
                if (spouseIndex >= 0) {
                    const spouseCount = sourceMember.spouseIds.length;
                    const totalSpousesWidth = spouseCount * nodeWidth + (spouseCount - 1) * spouseHorizontalGap;
                    const startX = d.source.x - totalSpousesWidth / 2;
                    
                    // Center of the specific spouse card
                    sourceX = startX + spouseIndex * (nodeWidth + spouseHorizontalGap) + nodeWidth / 2;
                    // Bottom of the spouse card (MainY + Height/2 + Gap + Height)
                    sourceY = d.source.y + nodeHeight/2 + spouseVerticalGap + nodeHeight; 
                } else {
                     // Fallback: If no matching spouse found
                }
            } else if (sourceMember.spouseIds && sourceMember.spouseIds.length > 0) {
                // If the man has spouses, but the child has no motherId recorded,
                // Ideally, we should extend the vertical line down past spouses.
                sourceY = d.source.y + nodeHeight/2 + spouseVerticalGap + nodeHeight;
            }

            const targetX = d.target.x;
            const targetY = d.target.y - nodeHeight/2; // Top of child node

            return `M${sourceX},${sourceY} 
                    C${sourceX},${(sourceY + targetY) / 2} 
                     ${targetX},${(sourceY + targetY) / 2} 
                     ${targetX},${targetY}`;
        });

    // --- DRAW NODES ---
    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Helper to draw a single card
    const drawCard = (selection: any, memberId: string | undefined, xPos: number, yPos: number, isSpouse: boolean) => {
        if (!memberId) return;
        
        // Fix: Use a single variable and check it
        const displayMember = members.find(m => m.id === memberId) || DataService.getMembers().find(m => m.id === memberId);
        
        if (!displayMember) return;

        const cardGroup = selection.append("g")
            .attr("transform", `translate(${xPos}, ${yPos})`)
            .style("cursor", "pointer")
            .on("click", (e: any) => {
                e.stopPropagation();
                setViewingMember(displayMember);
            });

        // Shadow
        cardGroup.append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("x", -nodeWidth / 2)
            .attr("y", -nodeHeight / 2)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "black")
            .attr("opacity", 0.05)
            .attr("transform", "translate(3, 3)");

        // Card Body
        cardGroup.append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("x", -nodeWidth / 2)
            .attr("y", -nodeHeight / 2)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", displayMember.gender === Gender.Male ? "#EBF8FF" : "#FFF5F7")
            .attr("stroke", displayMember.gender === Gender.Male ? "#4299E1" : "#ED64A6")
            .attr("stroke-width", isSpouse ? 1.5 : 2);

        // Name
        cardGroup.append("text")
            .attr("dy", "-5")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .style("fill", "#2C3E50")
            .text(displayMember.name);

        // Info
        cardGroup.append("text")
            .attr("dy", "15")
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#718096")
            .text(displayMember.deathDate ? "已故" : `${displayMember.birthDate?.split('-')[0] || '?'}生`);

        // Tag (Spouse Label)
        if (isSpouse) {
             const family = families.find(f => f.id === displayMember.familyId);
             const familyName = family ? family.name.replace(/.*(?:氏|族)/, '') : '';
             
             cardGroup.append("rect")
                .attr("width", 50)
                .attr("height", 16)
                .attr("x", -25)
                .attr("y", -nodeHeight/2 - 8)
                .attr("rx", 3)
                .attr("fill", "#ED64A6")
                .attr("stroke", "#fff");
             
             cardGroup.append("text")
                .attr("dy", -nodeHeight/2 + 3)
                .attr("text-anchor", "middle")
                .style("font-size", "9px")
                .style("fill", "white")
                .text(familyName ? `${familyName}氏` : "配偶");
        }
    };

    node.each(function(d: any) {
        const member = d.data.data as Member;
        const self = d3.select(this);

        // 1. Draw Main Member (Centered at 0,0)
        drawCard(self, member.id, 0, 0, false);

        // 2. Draw Spouses BELOW
        if (member.spouseIds && member.spouseIds.length > 0) {
            const spouseCount = member.spouseIds.length;
            const totalSpousesWidth = spouseCount * nodeWidth + (spouseCount - 1) * spouseHorizontalGap;
            const startX = -totalSpousesWidth / 2 + nodeWidth / 2; // Start X for the first spouse center
            const spousesY = nodeHeight + spouseVerticalGap - nodeHeight/2; 

            // Draw connecting lines (Bracket style)
            // Vertical from Main Bottom
            self.append("line")
                .attr("x1", 0)
                .attr("y1", nodeHeight/2)
                .attr("x2", 0)
                .attr("y2", nodeHeight/2 + spouseVerticalGap/2)
                .attr("stroke", "#FF6B6B")
                .attr("stroke-width", 1.5);

            // Horizontal bar across spouses
            const leftSpouseX = startX;
            const rightSpouseX = startX + (spouseCount - 1) * (nodeWidth + spouseHorizontalGap);
            
            self.append("line")
                .attr("x1", leftSpouseX)
                .attr("y1", nodeHeight/2 + spouseVerticalGap/2)
                .attr("x2", rightSpouseX)
                .attr("y2", nodeHeight/2 + spouseVerticalGap/2)
                .attr("stroke", "#FF6B6B")
                .attr("stroke-width", 1.5);

            member.spouseIds.forEach((spouseId, index) => {
                const xPos = startX + index * (nodeWidth + spouseHorizontalGap);
                
                // Draw vertical down to specific spouse
                self.append("line")
                    .attr("x1", xPos)
                    .attr("y1", nodeHeight/2 + spouseVerticalGap/2)
                    .attr("x2", xPos)
                    .attr("y2", 110 - nodeHeight/2) // To top of spouse card
                    .attr("stroke", "#FF6B6B")
                    .attr("stroke-width", 1.5);

                drawCard(self, spouseId, xPos, 110, true);
            });
        }
    });
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-4 z-10">
         <h2 className="text-3xl font-bold border-l-8 border-china-red pl-4">家族世系图</h2>
         <div className="flex items-center gap-2">
            <span className="font-bold">选择家族:</span>
            <select 
                className="border p-2 rounded shadow-sm"
                value={selectedFamilyId}
                onChange={e => setSelectedFamilyId(e.target.value)}
            >
                {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
         </div>
      </div>
      
      <div className="flex-1 bg-paper-gray rounded-xl shadow-inner overflow-hidden border border-gray-200 relative" ref={wrapperRef} style={{minHeight: '600px'}}>
        <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing"></svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow border text-xs z-10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2"><span className="w-3 h-3 bg-[#EBF8FF] border border-[#4299E1] rounded block"></span> 男性成员</div>
            <div className="flex items-center gap-2 mb-2"><span className="w-3 h-3 bg-[#FFF5F7] border border-[#ED64A6] rounded block"></span> 女性成员</div>
            <div className="flex items-center gap-2"><span className="w-8 h-1 border-t border-b border-[#FF6B6B] block"></span> 婚姻关系</div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {viewingMember && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setViewingMember(null)}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-[fadeIn_0.2s_ease-out]" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-china-red text-white p-6 relative">
                    <button 
                        onClick={() => setViewingMember(null)} 
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                    <div className="flex items-center gap-4">
                        <img 
                            src={viewingMember.photo} 
                            alt={viewingMember.name} 
                            className="w-20 h-20 rounded-full border-4 border-white/30 bg-white object-cover shadow-md"
                        />
                        <div>
                            <h3 className="text-2xl font-bold">{viewingMember.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-white/90 text-sm">
                                <span className="bg-white/20 px-2 py-0.5 rounded">第 {viewingMember.generation} 代</span>
                                <span>{viewingMember.gender === Gender.Male ? '男' : '女'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <span className="text-gray-500 block text-xs mb-1">出生日期</span>
                            <span className="font-semibold text-gray-800">{viewingMember.birthDate || '未知'}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <span className="text-gray-500 block text-xs mb-1">去世日期</span>
                            <span className="font-semibold text-gray-800">{viewingMember.deathDate || '在世'}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 border-l-4 border-china-red pl-2 mb-2 text-sm">生平简介</h4>
                        <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded border border-gray-100 h-24 overflow-y-auto">
                            {viewingMember.bio || '暂无简介'}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 border-l-4 border-noble-gold pl-2 mb-2 text-sm">直系亲属</h4>
                        <div className="space-y-2 text-sm">
                            {relatedMembers.father && (
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">父亲</span>
                                    <span className="font-medium text-china-red cursor-pointer hover:bg-red-50 px-2 py-0.5 rounded transition-colors" onClick={() => setViewingMember(relatedMembers.father!)}>
                                        {relatedMembers.father.name} <i className="fas fa-chevron-right text-xs ml-1"></i>
                                    </span>
                                </div>
                            )}
                            {relatedMembers.mother && (
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">母亲</span>
                                    <span className="font-medium text-china-red cursor-pointer hover:bg-red-50 px-2 py-0.5 rounded transition-colors" onClick={() => setViewingMember(relatedMembers.mother!)}>
                                        {relatedMembers.mother.name} <i className="fas fa-chevron-right text-xs ml-1"></i>
                                    </span>
                                </div>
                            )}
                            {relatedMembers.spouse && relatedMembers.spouse.length > 0 && (
                                <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                                    <span className="text-gray-500 pt-1">配偶</span>
                                    <div className="text-right space-y-1">
                                        {relatedMembers.spouse.map(s => (
                                            <span 
                                                key={s.id} 
                                                className="font-medium text-china-red cursor-pointer hover:bg-red-50 px-2 py-0.5 rounded transition-colors block"
                                                onClick={() => setViewingMember(s)}
                                            >
                                                {s.name} <i className="fas fa-chevron-right text-xs ml-1"></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                    <button 
                        onClick={() => navigate(`/members?familyId=${viewingMember.familyId}`)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-white hover:text-china-red hover:border-china-red transition-all text-sm font-medium"
                    >
                        <i className="fas fa-edit mr-1"></i> 编辑成员
                    </button>
                    <button 
                        onClick={() => setViewingMember(null)}
                        className="px-4 py-2 bg-china-red text-white rounded hover:bg-red-700 transition-colors text-sm font-medium shadow"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
