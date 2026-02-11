
import React, { useState } from 'react';
import { Book, ChevronDown, ChevronRight, Bookmark, Search } from 'lucide-react';

const LIBRARY_DATA = [
  {
    unit: 1,
    title: "Local Community",
    grammar: "Comparison of adjectives and adverbs",
    details: "Ôn tập so sánh bằng, so sánh hơn và so sánh nhất của tính từ/trạng từ ngắn và dài."
  },
  {
    unit: 2,
    title: "City Life",
    grammar: "Phrasal verbs",
    details: "Cách sử dụng các cụm động từ phổ biến: get over, turn down, look forward to, v.v."
  },
  {
    unit: 3,
    title: "Teen stress and pressure",
    grammar: "Reported speech",
    details: "Câu gián tiếp: Thay đổi thì, đại từ và trạng ngữ chỉ thời gian/nơi chốn."
  },
  {
    unit: 4,
    title: "Life in the past",
    grammar: "Used to & Wish clauses",
    details: "Used to diễn tả thói quen quá khứ. Wish clauses cho hiện tại (S + wish + S + V-ed/2)."
  },
  {
    unit: 5,
    title: "Our Heritage",
    grammar: "Passive voice with reporting verbs",
    details: "Câu bị động với các động từ tường thuật (It is said that... / S is said to V)."
  }
];

const LibrarySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  const filtered = LIBRARY_DATA.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.grammar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl font-black">Thư viện Unit 1-12</h2>
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm chủ điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.unit}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedUnit(expandedUnit === item.unit ? null : item.unit)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex flex-col items-center justify-center font-bold">
                  <span className="text-xs uppercase">Unit</span>
                  <span className="text-xl">{item.unit}</span>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-blue-600 font-medium">{item.grammar}</p>
                </div>
              </div>
              <div className="text-gray-400">
                {expandedUnit === item.unit ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
              </div>
            </button>

            {expandedUnit === item.unit && (
              <div className="p-8 border-t border-gray-50 bg-gray-50/50 space-y-6 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="font-bold flex items-center gap-2">
                      <Book size={18} className="text-blue-500" />
                      Lý thuyết trọng tâm
                    </h5>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.details}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-bold flex items-center gap-2">
                      <Bookmark size={18} className="text-orange-500" />
                      Công thức & Ví dụ
                    </h5>
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <code className="text-blue-600 font-mono block mb-2">
                        {item.unit === 4 ? "S + wish + S + V2/ed" : "More than/Less than..."}
                      </code>
                      <p className="text-sm text-gray-500">I wish I lived in a big city.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                    Tải file ôn tập chi tiết (PDF) <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">Không tìm thấy Unit nào khớp với từ khóa của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarySection;
