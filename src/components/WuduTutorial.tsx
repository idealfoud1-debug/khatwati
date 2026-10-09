import React, { useState } from 'react';
import { WUDU_8_STEPS } from '../data/prayerEducationData';
import { WuduStep } from '../types';
import { CheckCircle, AlertTriangle, Droplets, BookOpen, Layers } from 'lucide-react';

export const WuduTutorial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wudu' | 'ghusl' | 'tayammum' | 'invalidators'>('wudu');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const step = WUDU_8_STEPS[selectedStepIndex];

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">الطهارة مفتاح الصلاة</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
            دليل الوضوء والطهارة الكامل
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('wudu')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === 'wudu'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-emerald-700" />
          <span>خطوات الوضوء (8)</span>
        </button>
        <button
          onClick={() => setActiveTab('invalidators')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === 'invalidators'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>نواقض الوضوء</span>
        </button>
        <button
          onClick={() => setActiveTab('ghusl')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ghusl'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>صفة الغسل الشرعي</span>
        </button>
        <button
          onClick={() => setActiveTab('tayammum')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
            activeTab === 'tayammum'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>التيمم بالصعيد الطاهر</span>
        </button>
      </div>

      {/* Tab 1: Wudu Steps */}
      {activeTab === 'wudu' && (
        <div>
          {/* Step selector horizontal pills */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-5">
            {WUDU_8_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedStepIndex(idx)}
                className={`py-2 px-1 rounded-xl text-xs text-center border transition cursor-pointer ${
                  selectedStepIndex === idx
                    ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-[10px] opacity-75">خطوة {s.stepNumber}</span>
                <span className="block truncate text-[11px] font-semibold">{s.titleArabic.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Current Step Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                    {step.stepNumber}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-ui">{step.titleArabic}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{step.titleDarija}</p>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  step.isFaridha
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                {step.isFaridha ? 'فرض في المذهب المالكي' : 'سنة مستحبة'}
              </span>
            </div>

            {/* Instruction */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
              <span className="font-bold text-emerald-950 block mb-1">الشرح بالدارجة:</span>
              <p>{step.instructionDarija}</p>
            </div>

            {/* Dua if available */}
            {step.duaaArabic && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1">الذكر أو الدعاء المشروع:</span>
                <p className="font-quran text-base font-bold text-emerald-950">{step.duaaArabic}</p>
                {step.duaaDarija && (
                  <p className="text-xs text-slate-600 mt-1">{step.duaaDarija}</p>
                )}
              </div>
            )}

            {/* Caution note */}
            {step.cautionNote && (
              <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{step.cautionNote}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>المصدر: {step.source}</span>
              <span className="text-emerald-700 font-semibold">مدقق وفق الفقه المالكي</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Invalidators of Wudu (نواقض الوضوء) */}
      {activeTab === 'invalidators' && (
        <div className="space-y-3">
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200/70 text-rose-950 text-xs">
            <h4 className="font-bold text-sm text-rose-900 mb-1">ما هي نواقض الوضوء؟</h4>
            <p>
              نواقض الوضوء هي الأشياء التي إذا حدثت يبطل وضوء المسلم ويجب عليه الوضوء مجدداً قبل الصلاة.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                title: 'الخارج من السبيلين (البول أو الغائط)',
                desc: 'كل ما يخرج من مخرج البول أو الغائط يبطل الوضوء بالإجماع بنص القرآن والسنة.',
                type: 'ناقض مجمع عليه'
              },
              {
                title: 'خروج الريح بصوت أو ريح',
                desc: 'لقوله ﷺ: «لا ينصرف حتى يسمع صوتاً أو يجد ريحاً» (صحيح البخاري).',
                type: 'ناقض مجمع عليه'
              },
              {
                title: 'زوال العقل بالنوم الثقيل أو الإغماء',
                desc: 'النوم الثقيل الذي لا يشعر معه الإنسان بما حوله ينقض الوضوء، بخلاف النعاس الخفيف.',
                type: 'المذهب المالكي'
              },
              {
                title: 'مس الفرج أو العورة باليد مباشرة',
                desc: 'مس العورة ببطن الكف أو الأصابع بدون حائل ينقض الوضوء.',
                type: 'سنة مأثورة'
              },
              {
                title: 'الردة أو الشك في الطهارة',
                desc: 'في المذهب المالكي: الشك في الحدث ينقض الوضوء لأن الأصل طلب اليقين للطهارة.',
                type: 'معتمد المالكية'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-slate-900">{item.title}</h5>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Ghusl */}
      {activeTab === 'ghusl' && (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/70 text-indigo-950">
            <h4 className="font-bold text-indigo-900 text-sm mb-1">الغسل الأكبر (رفع الجنابة والحيض والنفاس)</h4>
            <p>
              الغسل الشرعي هو تعميم سائر الجسد بالماء الطاهر بنية رفع الحدث الأكبر.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-slate-900">كيفية الغسل الكامل على سنة النبي ﷺ:</h5>
            <ol className="list-decimal list-inside space-y-2 text-slate-800 pr-1 leading-relaxed">
              <li><strong>النية:</strong> استحضار نية رفع الحدث الأكبر بالقلب.</li>
              <li><strong>التسمية وغسل الكفين:</strong> غسل اليدين ثلاث مرات وإزالة أي نجاسة عن البدن.</li>
              <li><strong>الوضوء الأصغر:</strong> الوضوء تماماً كالوضوء للصلاة (ويجوز تأخير غسل الرجلين للآخر).</li>
              <li><strong>تخليل شعر الرأس:</strong> إيصال الماء إلى أصول الشعر باليدين ثلاث مرات.</li>
              <li><strong>إفاضة الماء على الرأس:</strong> صب الماء على الرأس ثلاث مرات.</li>
              <li><strong>غسل الشق الأيمن ثم الأيسر:</strong> تعميم الجسد كاملاً بالماء مع الدلك وتفقد الإبطين والسرة.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 4: Tayammum */}
      {activeTab === 'tayammum' && (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 text-amber-950">
            <h4 className="font-bold text-amber-900 text-sm mb-1">التيمم عند فقد الماء أو المرض</h4>
            <p>
              رخصة وتيسير من الله سبحانه وتعالى بالتراب أو الصعيد الطاهر عند انعدام الماء أو العجز عن استعماله لمرض.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-slate-900">خطوات التيمم الصحيحة:</h5>
            <ol className="list-decimal list-inside space-y-2 text-slate-800 pr-1 leading-relaxed">
              <li><strong>النية:</strong> نية استباحة الصلاة بالتيمم.</li>
              <li><strong>الضربة الأولى:</strong> ضرب الصعيد الطاهر (الحجر أو التراب النظيف) بالكفين ضربة واحدة.</li>
              <li><strong>مسح الوجه:</strong> مسح الوجه كاملاً باليدين.</li>
              <li><strong>مسح الكفين إلى المرفقين:</strong> مسح ظاهر وباطن اليدين إلى المرفقين (أو إلى الكوعين في السنة المجزئة).</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
