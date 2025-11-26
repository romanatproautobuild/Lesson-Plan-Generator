import React, { useState } from 'react';
import { LessonPlanResponse } from '../types';
import { CheckCircle2, Clock, Users, Gamepad2, FileText, ClipboardCopy, FileCheck, Download, Home, FileOutput } from 'lucide-react';
import { downloadLessonPlanPDF, downloadMaterialsPDF, downloadHomeworkPDF } from '../services/pdfService';

interface PlanDisplayProps {
  plan: LessonPlanResponse;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'materials' | 'games'>('schedule');

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8 border-b border-indigo-100">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{plan.title}</h2>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => downloadLessonPlanPDF(plan)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Plan
            </button>
            <button 
              onClick={() => downloadMaterialsPDF(plan)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" /> Materials PDF
            </button>
            <button 
              onClick={() => downloadHomeworkPDF(plan)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" /> Homework PDF
            </button>
          </div>
        </div>

        <div className="space-y-2">
           <h3 className="text-sm font-semibold text-indigo-800 uppercase tracking-wide">Objectives:</h3>
           <ul className="space-y-1">
             {plan.objectives.map((obj, idx) => (
               <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                 <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                 <span>{obj}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
            activeTab === 'schedule'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Schedule
          </span>
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
            activeTab === 'games'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
           <span className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4" /> Games
          </span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
            activeTab === 'materials'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
           <span className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Materials & HW
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <h4 className="font-bold text-amber-800 text-sm mb-1 uppercase">Warm Up</h4>
              <p className="text-amber-900">{plan.warmUp}</p>
            </div>

            <div className="space-y-4">
              {plan.schedule.map((activity, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative group hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {activity.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border">
                      <Users className="w-3 h-3" /> {activity.interaction}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{activity.activityName}</h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{activity.procedure}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5" /> Teacher's Notes (Vietnam Context)
              </h4>
              <p className="text-blue-900 text-sm italic">{plan.teacherNotes}</p>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            {plan.games.map((game, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-indigo-600 px-6 py-3">
                  <h3 className="text-white font-bold text-lg">{game.name}</h3>
                </div>
                <div className="p-6 bg-white space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Materials Needed</h4>
                    <p className="text-gray-800 font-medium">{game.materialsNeeded}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">How to Play</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{game.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
            {plan.games.length === 0 && <p className="text-center text-gray-500">No specific games generated for this lesson.</p>}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-800 text-xl border-b pb-2">Homework Assignment</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">{plan.homework}</p>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-gray-800 text-xl">Worksheet / Handout Content</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(plan.worksheetContent)}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <ClipboardCopy className="w-4 h-4" /> Copy Text
                </button>
               </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                {plan.worksheetContent}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                * Copy the text above and paste it into a Word document or Slide to create your printable material.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDisplay;