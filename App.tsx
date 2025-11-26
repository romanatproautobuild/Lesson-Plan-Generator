import React, { useState } from 'react';
import { generateLessonPlan } from './services/geminiService';
import { LessonRequest, LessonPlanResponse } from './types';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: LessonRequest) => {
    setLoading(true);
    setError(null);
    setLessonPlan(null); // Clear previous plan while loading

    try {
      const result = await generateLessonPlan(request);
      setLessonPlan(result);
    } catch (err) {
      setError("Failed to generate lesson plan. Please check your internet connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
              VietPlan AI
            </h1>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">ESL Lesson Generator for Vietnam</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 xl:col-span-4">
             <div className="sticky top-24">
               <InputForm isLoading={loading} onSubmit={handleGenerate} />
               
               {error && (
                 <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                   <strong>Error:</strong> {error}
                 </div>
               )}
             </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8 min-h-[500px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-12">
                 <div className="relative">
                   <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                   <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6 animate-pulse" />
                 </div>
                 <h3 className="text-xl font-semibold text-gray-800">Designing your lesson...</h3>
                 <p className="text-gray-500 text-center max-w-sm">
                   We're crafting objectives, scheduling activities, and creating games tailored for your Vietnamese ESL class.
                 </p>
              </div>
            ) : lessonPlan ? (
              <PlanDisplay plan={lessonPlan} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                   <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Plan?</h3>
                <p className="text-gray-500 max-w-md">
                  Fill out the details on the left to generate a comprehensive lesson plan including schedule, games, and printable materials.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;