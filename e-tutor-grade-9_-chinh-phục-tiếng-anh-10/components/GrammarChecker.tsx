
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Send, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { analyzeGrammar } from '../services/geminiService';
import { GrammarError } from '../types';

const GrammarChecker: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText && !selectedImage) return;
    
    setIsAnalyzing(true);
    setErrors([]);
    setErrorMsg('');
    
    try {
      const result = await analyzeGrammar(inputText, selectedImage || undefined);
      setErrors(result);
      if (result.length === 0) {
        setErrorMsg('Không tìm thấy lỗi ngữ pháp nào. Tuyệt vời!');
      }
    } catch (err: any) {
      setErrorMsg('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Nhập bài tập</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                title="Tải ảnh lên"
              >
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập câu tiếng Anh hoặc bài tập của bạn vào đây..."
            className="flex-1 w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 resize-none text-lg min-h-[200px]"
          />

          {selectedImage && (
            <div className="mt-4 relative group">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-48 rounded-xl object-contain border border-gray-200" 
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
              >
                <ImageIcon size={16} />
              </button>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!inputText && !selectedImage)}
            className="mt-6 w-full py-4 bg-gradient-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:scale-[1.02] transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Đang quét lỗi...
              </>
            ) : (
              <>
                <CheckCircle2 size={24} />
                Quét lỗi ngữ pháp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6 h-full flex flex-col">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Kết quả phân tích 
          {errors.length > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{errors.length} lỗi</span>}
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 pb-8 pr-2 custom-scrollbar">
          {errorMsg && !errors.length && (
            <div className={`p-6 rounded-3xl border ${errorMsg.includes('Tuyệt vời') ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-3">
                {errorMsg.includes('Tuyệt vời') ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                <p className={`font-semibold ${errorMsg.includes('Tuyệt vời') ? 'text-green-800' : 'text-red-800'}`}>{errorMsg}</p>
              </div>
            </div>
          )}

          {!isAnalyzing && errors.length === 0 && !errorMsg && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={48} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-500">
                Chưa có dữ liệu phân tích.<br/>Hãy nhập bài tập bên trái để AI kiểm tra nhé!
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-50 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {errors.map((err, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Unit {err.unit}</span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Lỗi sai</span>
                  </div>
                  <p className="text-gray-500 line-through text-lg mb-1">{err.error}</p>
                  <p className="text-green-600 text-xl font-bold">{err.correction}</p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-blue-800 mb-1">Tại sao sai?</p>
                    <p className="text-sm text-blue-700 leading-relaxed">{err.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
