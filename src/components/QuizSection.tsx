import React, { useState, useEffect } from 'react';
import { QUIZ_CATEGORIES, STANDALONE_QUIZ_QUESTIONS } from '../data/quizData';
import { QuizCategoryId, StandaloneQuizQuestion, QuizCategoryInfo } from '../types';
import { storageService } from '../services/storageService';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Compass,
  Droplets,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuizSectionProps {
  initialCategoryId?: QuizCategoryId;
  onBackToLessons?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  initialCategoryId,
  onBackToLessons,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategoryId | null>(
    initialCategoryId || null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<
    Array<{ questionId: string; selectedIndex: number; isCorrect: boolean }>
  >([]);
  const [completedQuizzesStats, setCompletedQuizzesStats] = useState<
    Record<string, { score: number; total: number; completedAt: string }>
  >({});

  useEffect(() => {
    setCompletedQuizzesStats(storageService.getQuizAttempts());
  }, [isQuizCompleted]);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
      resetActiveQuiz();
    }
  }, [initialCategoryId]);

  const activeCategoryInfo: QuizCategoryInfo | undefined = QUIZ_CATEGORIES.find(
    (c) => c.id === selectedCategory
  );

  const categoryQuestions: StandaloneQuizQuestion[] = selectedCategory
    ? STANDALONE_QUIZ_QUESTIONS.filter((q) => q.categoryId === selectedCategory)
    : [];

  const currentQuestion: StandaloneQuizQuestion | undefined =
    categoryQuestions[currentQuestionIndex];

  const resetActiveQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsQuizCompleted(false);
    setUserAnswersHistory([]);
  };

  const handleStartCategory = (catId: QuizCategoryId) => {
    setSelectedCategory(catId);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsQuizCompleted(false);
    setUserAnswersHistory([]);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed || !currentQuestion) return;

    setSelectedOptionIndex(index);
    setIsAnswerRevealed(true);

    const isCorrect = index === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerRevealed(false);
    } else {
      // Quiz finished
      const finalScore =
        score +
        (selectedOptionIndex === currentQuestion?.correctOptionIndex ? 1 : 0);
      setIsQuizCompleted(true);
      if (selectedCategory) {
        storageService.saveQuizAttempt(
          selectedCategory,
          finalScore,
          categoryQuestions.length
        );
      }
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  // --------------------------------------------------------------------------
  // VIEW 1: CATEGORY SELECTION DIRECTORY
  // --------------------------------------------------------------------------
  if (!selectedCategory || categoryQuestions.length === 0) {
    return (
      <div className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>تثبيت العلم الشرعي بالتدريب</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
              الاختبارات الإسلامية والتقييم الذاتي
            </h2>
            <p className="text-xs text-slate-500">
              اختبارات فقهية وتربوية موثقة تساعدك على التحقق من صحة معلوماتك في الصلاة والقرآن والطهارة
            </p>
          </div>

          {onBackToLessons && (
            <button
              onClick={onBackToLessons}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-800 self-start sm:self-center cursor-pointer"
            >
              <span>العودة للمنهج الدراسي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {QUIZ_CATEGORIES.map((cat) => {
            const progress = completedQuizzesStats[cat.id];
            return (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between text-right"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    {progress ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>
                          تم الإنجاز: {progress.score} / {progress.total}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {cat.questionsCount} أسئلة
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-ui mb-1.5">
                    {cat.titleArabic}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.descriptionDarija}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    الوقت المقدر: ~{cat.estimatedMinutes} دقائق
                  </span>
                  <button
                    onClick={() => handleStartCategory(cat.id)}
                    className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-2xs cursor-pointer"
                  >
                    <span>{progress ? 'إعادة الاختبار' : 'بدء الاختبار'}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: QUIZ COMPLETED SUMMARY SCREEN
  // --------------------------------------------------------------------------
  if (isQuizCompleted) {
    const totalQ = categoryQuestions.length;
    const percentage = Math.round((score / totalQ) * 100);

    return (
      <div className="bg-white rounded-3xl border border-emerald-900/10 p-6 sm:p-10 text-right space-y-6 max-w-2xl mx-auto shadow-xs animate-in fade-in">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-950 font-ui">
            نتيجة اختبار: {activeCategoryInfo?.titleArabic}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            أحسنت! طلب العلم الشرعي من أعظم القربات، والتعلم المستمر طريق الطمأنينة.
          </p>

          {/* Score Badge */}
          <div className="py-4">
            <div className="inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-4xl font-extrabold text-emerald-900 font-mono">
                {score}
              </span>
              <span className="text-sm font-bold text-emerald-700 font-ui">
                من أصل {totalQ} أسئلة ({percentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Review of Question Answers */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 font-ui">
            مراجعة الأسئلة والأجوبة مع الشرح بالدارجة:
          </h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {categoryQuestions.map((q, idx) => {
              const userRec = userAnswersHistory.find((a) => a.questionId === q.id);
              const isUserCorrect =
                userRec?.selectedIndex === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                    isUserCorrect
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold">
                      السؤال {idx + 1}: {q.questionArabic}
                    </span>
                    {isUserCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>صحيح</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>غير صحيح</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80">
                    <strong className="text-emerald-900">✅ الجواب الصحيح: </strong>
                    {q.optionsArabic[q.correctOptionIndex]}
                  </p>

                  <p className="text-[11px] text-slate-600">
                    <strong>الشرح بالدارجة:</strong> {q.explanationDarija}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            الانتقال لاختبار آخر
          </button>

          <button
            onClick={resetActiveQuiz}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة هذا الاختبار</span>
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 3: ACTIVE QUESTION IN PROGRESS
  // --------------------------------------------------------------------------
  if (!currentQuestion) return null;

  const currentNumber = currentQuestionIndex + 1;
  const totalCount = categoryQuestions.length;
  const progressRatio = (currentNumber / totalCount) * 100;
  const isSelectedCorrect =
    selectedOptionIndex === currentQuestion.correctOptionIndex;

  return (
    <div className="bg-white rounded-3xl border border-emerald-900/10 p-5 sm:p-8 shadow-xs text-right space-y-6 max-w-2xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <button
          onClick={() => setSelectedCategory(null)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-800 transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>قائمة الاختبارات</span>
        </button>

        <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 font-mono">
          السؤال {currentNumber} من {totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-700 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressRatio}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/5 border border-emerald-900/10">
          <span className="text-[11px] font-bold text-emerald-800 block mb-1">
            {activeCategoryInfo?.titleArabic}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-ui leading-relaxed">
            {currentQuestion.questionArabic}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.optionsArabic.map((optionText, optIdx) => {
            const isSelected = selectedOptionIndex === optIdx;
            const isCorrect = optIdx === currentQuestion.correctOptionIndex;

            let buttonStyle =
              'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800';
            let iconElement = null;

            if (isAnswerRevealed) {
              if (isCorrect) {
                buttonStyle =
                  'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20 font-bold';
                iconElement = (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                );
              } else if (isSelected) {
                buttonStyle =
                  'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-500/20';
                iconElement = (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                );
              } else {
                buttonStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswerRevealed}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${buttonStyle} ${
                  !isAnswerRevealed ? 'cursor-pointer hover:border-emerald-300' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/80 border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{optionText}</span>
                </div>
                {iconElement}
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Answer Feedback & Explanation Card */}
      {isAnswerRevealed && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-top-2 ${
            isSelectedCorrect
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {isSelectedCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <h4 className="font-bold text-sm text-emerald-900">
                  إجابة صحيحة، أحسنت!
                </h4>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                <h4 className="font-bold text-sm text-rose-900">
                  إجابة غير صحيحة — الجواب المعتمد: «
                  {currentQuestion.optionsArabic[currentQuestion.correctOptionIndex]}»
                </h4>
              </>
            )}
          </div>

          {/* Explanation in Moroccan Darija */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs leading-relaxed text-slate-700">
            <strong className="block text-emerald-900 font-bold mb-1">
              💡 الشرح بالدارجة المغربية:
            </strong>
            <p>{currentQuestion.explanationDarija}</p>
          </div>

          {/* Religious Source & Hadith Reference */}
          {currentQuestion.evidenceHadithOrAyah && (
            <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200">
              <strong className="text-emerald-800">الدليل الشرعي: </strong>
              {currentQuestion.evidenceHadithOrAyah} ({currentQuestion.source})
            </p>
          )}

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <span>
                {currentQuestionIndex < categoryQuestions.length - 1
                  ? 'السؤال التالي'
                  : 'عرض النتيجة النهائية'}
              </span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
