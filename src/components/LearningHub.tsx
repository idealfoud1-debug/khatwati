import React, { useState, useEffect } from 'react';
import { LEARNING_LESSONS } from '../data/curriculumData';
import { LearningLesson, QuizQuestion, QuizCategoryId } from '../types';
import { QuizSection } from './QuizSection';
import {
  GraduationCap,
  Users,
  Smile,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface LearningHubProps {
  initialView?: 'curriculum' | 'quizzes';
  initialQuizCategory?: QuizCategoryId;
}

export const LearningHub: React.FC<LearningHubProps> = ({
  initialView = 'curriculum',
  initialQuizCategory,
}) => {
  const [hubMode, setHubMode] = useState<'curriculum' | 'quizzes'>(initialView);
  const [selectedAudience, setSelectedAudience] = useState<'ADULTS' | 'CHILDREN'>('ADULTS');
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);
  const [quizModalLesson, setQuizModalLesson] = useState<LearningLesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (initialView) {
      setHubMode(initialView);
    }
  }, [initialView]);

  const lessons = LEARNING_LESSONS.filter((l) => l.audience === selectedAudience);

  const handleStartQuiz = (lesson: LearningLesson) => {
    setQuizModalLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const calculateScore = (questions: QuizQuestion[]) => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">طلب العلم فريضة</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
            مسارات التعلم والتفقه
          </h2>
          <p className="text-xs text-slate-500">
            دروس إسلامية متدرجة مصممة للكبار والأطفال مع قسم مخصص للاختبارات التفاعلية
          </p>
        </div>

        {/* Track & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setHubMode('curriculum');
              setSelectedAudience('ADULTS');
              setActiveLesson(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              hubMode === 'curriculum' && selectedAudience === 'ADULTS'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>مسار الكبار</span>
          </button>
          <button
            onClick={() => {
              setHubMode('curriculum');
              setSelectedAudience('CHILDREN');
              setActiveLesson(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              hubMode === 'curriculum' && selectedAudience === 'CHILDREN'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>مسار الأطفال</span>
          </button>
          <button
            onClick={() => {
              setHubMode('quizzes');
              setActiveLesson(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              hubMode === 'quizzes'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>الاختبارات</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render Quizzes View OR Curriculum View */}
      {hubMode === 'quizzes' ? (
        <QuizSection
          initialCategoryId={initialQuizCategory}
          onBackToLessons={() => setHubMode('curriculum')}
        />
      ) : (
        /* Lessons List Grid */
        <div className="grid sm:grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                  {lesson.moduleOrder}
                </span>
                <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {lesson.audience === 'ADULTS' ? 'مبتدئ / عام' : 'أطفال وناشئة'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-ui mb-1.5">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {lesson.summaryDarija}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveLesson(lesson)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>قراءة الدرس</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              {lesson.quiz && lesson.quiz.length > 0 && (
                <button
                  onClick={() => handleStartQuiz(lesson)}
                  className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>اختبر فهمك</span>
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Lesson Reader Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto text-right border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-emerald-950 font-ui">
                {activeLesson.title}
              </h3>
            </div>

            <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200/80 text-emerald-950 text-xs">
                <strong>الخلاصة بالدارجة: </strong> {activeLesson.explanationDarija}
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-sm">تفاصيل الدرس:</h4>
                <ul className="space-y-2">
                  {activeLesson.contentDarija.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950 text-xs">
                <span className="font-bold block text-amber-900 mb-0.5">القيمة المستفادة:</span>
                <p>{activeLesson.keyTakeaway}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                المصدر المعتمد: {activeLesson.source}
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
              >
                إغلاق
              </button>
              {activeLesson.quiz && (
                <button
                  onClick={() => {
                    const l = activeLesson;
                    setActiveLesson(null);
                    handleStartQuiz(l);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>بدء الاختبار لهذا الدرس</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quizModalLesson && quizModalLesson.quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto text-right border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <button
                onClick={() => setQuizModalLesson(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-800 block">اختبار تثبيت المعلومة</span>
                <h3 className="text-base font-bold text-slate-900 font-ui">
                  {quizModalLesson.title}
                </h3>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {quizModalLesson.quiz.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctOptionIndex;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <span>{q.questionArabic}</span>
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.optionsArabic.map((opt, optIndex) => {
                        const isSelected = userChoice === optIndex;
                        let optionStyle = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';

                        if (quizSubmitted) {
                          if (optIndex === q.correctOptionIndex) {
                            optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-emerald-800 text-white font-bold border-emerald-800';
                        }

                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            className={`w-full text-right p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIndex === q.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && optIndex !== q.correctOptionIndex && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer Explanation once submitted */}
                    {quizSubmitted && (
                      <div className="mt-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                        <strong className="text-emerald-900">الشرح والتوضيح: </strong>
                        {q.explanationDarija}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Score & Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {quizSubmitted ? (
                <div className="text-center space-y-3">
                  <div className="inline-block p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-800 font-bold mb-1">النتيجة النهائية:</p>
                    <p className="text-2xl font-bold font-mono text-emerald-950">
                      {calculateScore(quizModalLesson.quiz)} من {quizModalLesson.quiz.length}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setQuizModalLesson(null)}
                      className="px-6 py-2 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition cursor-pointer"
                    >
                      إتمام الاختبار والعودة
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length < quizModalLesson.quiz.length}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    Object.keys(selectedAnswers).length < quizModalLesson.quiz.length
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                >
                  تصحيح الإجابات وعرض النتيجة
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
