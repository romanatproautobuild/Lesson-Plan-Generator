import React, { useState, useRef } from 'react';
import { ClassSize, CEFRLevel, LessonDuration, LessonFocus, LessonRequest, AgeGroup, FileData } from '../types';
import { BookOpen, Users, Clock, Brain, MessageSquare, List, Upload, X, FileText } from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (data: LessonRequest) => void;
}

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [classSize, setClassSize] = useState<string>(ClassSize.Medium);
  const [age, setAge] = useState<string>(AgeGroup.Primary);
  const [level, setLevel] = useState<string>(CEFRLevel.A2);
  const [duration, setDuration] = useState<string>(LessonDuration.Min45);
  const [focus, setFocus] = useState<string[]>([LessonFocus.Vocabulary]);
  const [context, setContext] = useState('');
  const [fileData, setFileData] = useState<FileData | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFocusChange = (selectedFocus: string) => {
    setFocus(prev => 
      prev.includes(selectedFocus) 
        ? prev.filter(f => f !== selectedFocus)
        : [...prev, selectedFocus]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('Please upload an image or PDF file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        
        setFileData({
          mimeType: file.type,
          data: base64Data,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFileData(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    onSubmit({
      topic,
      classSize,
      age,
      level,
      focus,
      duration,
      context,
      fileData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6 border border-gray-100">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Lesson Details
        </h2>
        <p className="text-gray-500 text-sm mt-1">Configure your ESL lesson parameters below.</p>
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Topic *</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Travel vocabulary, Past Simple Tense, Ordering Food"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>

      {/* Grid for Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Class Size
          </label>
          <select 
            value={classSize}
            onChange={(e) => setClassSize(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
          >
            {Object.values(ClassSize).map((size) => (
              <option key={size} value={size} className="text-gray-900 bg-white">{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Duration
          </label>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
          >
            {Object.values(LessonDuration).map((d) => (
              <option key={d} value={d} className="text-gray-900 bg-white">{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" /> Student Age
          </label>
          <select 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
          >
             {Object.values(AgeGroup).map((a) => (
              <option key={a} value={a} className="text-gray-900 bg-white">{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <List className="w-4 h-4" /> Level (CEFR)
          </label>
          <select 
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
          >
            {Object.values(CEFRLevel).map((l) => (
              <option key={l} value={l} className="text-gray-900 bg-white">{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Focus Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Lesson Focus (Select multiple)</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(LessonFocus).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFocusChange(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                focus.includes(f)
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Context Text Area & File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Additional Context (Optional)
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., The students love singing, they are preparing for a speaking test, avoid complex grammar..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-24 resize-none outline-none bg-white text-gray-900 placeholder-gray-400 mb-3"
        />
        
        {/* File Upload UI */}
        <div className="flex flex-col gap-2">
          <input 
            type="file" 
            accept="image/*,.pdf" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            id="file-upload"
          />
          
          {!fileData ? (
            <label 
              htmlFor="file-upload" 
              className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-gray-50 transition-all text-gray-600 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF or Image (Context/Materials)</span>
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <div className="flex items-center gap-2 text-indigo-800 overflow-hidden">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate max-w-[200px]">{fileData.fileName}</span>
              </div>
              <button 
                type="button" 
                onClick={clearFile}
                className="p-1 hover:bg-indigo-100 rounded-full text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all transform hover:scale-[1.02] ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Lesson...
          </span>
        ) : (
          "Generate Lesson Plan"
        )}
      </button>
    </form>
  );
};

export default InputForm;