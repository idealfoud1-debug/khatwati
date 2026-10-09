import React, { useState } from 'react';
import { USER_VIDEOS_LIBRARY } from '../data/videosData';
import { VideoItem } from '../types';
import {
  Play,
  Film,
  Search,
  ExternalLink,
  X,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface VideosGalleryProps {
  onNavigateToLesson?: (category: string) => void;
}

export const VideosGallery: React.FC<VideosGalleryProps> = ({ onNavigateToLesson }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'جميع الفيديوهات' },
    { id: 'PRAYER', label: 'شرح الصلاة' },
    { id: 'MISTAKES', label: 'أخطاء الصلاة' },
    { id: 'KHUSHU', label: 'الخشوع والتركيز' },
    { id: 'CHILDREN', label: 'تعليم الأطفال' },
  ];

  const filteredVideos = USER_VIDEOS_LIBRARY.filter((v) => {
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesSearch =
      v.title.includes(searchQuery) ||
      v.instructor.includes(searchQuery) ||
      v.explanationDarija.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">المكتبة المرئية المعتمدة</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
            فيديوهات تعليمية موثوقة
          </h2>
          <p className="text-xs text-slate-500">
            شروحات مرئية تطبيقية لكبار العلماء والمربين لتعلم الصلاة والوضوء والخشوع
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="ابحث في الفيديوهات أو الشيوخ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-emerald-800 text-amber-300 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Thumbnail Mockup / Poster */}
            <div className="relative aspect-video bg-emerald-950 flex items-center justify-center overflow-hidden group">
              {video.hasValidUrl && video.youtubeId ? (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="absolute w-12 h-12 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer"
                    title="تشغيل الفيديو"
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-amber-200 space-y-1">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
                  <p className="text-xs font-bold">قيد الاعتماد والمراجعة</p>
                  <p className="text-[10px] text-slate-300">يحتاج رابط / غير مربوط بعد</p>
                </div>
              )}

              {/* Duration badge if available */}
              {video.durationApprox && (
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>{video.durationApprox}</span>
                </div>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {video.categoryArabic}
                  </span>
                  <span className="text-[10px] text-slate-500">فيديو #{video.order}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {video.explanationDarija}
                </p>
              </div>

              {/* Footer action */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium truncate">
                  {video.instructor}
                </span>

                {video.hasValidUrl ? (
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>مشاهدة</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                ) : (
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                    غير متاح حالياً
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Player Modal */}
      {activeVideo && activeVideo.youtubeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl text-right">
            <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="truncate pl-4">
                <h3 className="font-bold text-sm text-white truncate">{activeVideo.title}</h3>
                <span className="text-xs text-emerald-300">{activeVideo.instructor}</span>
              </div>
            </div>

            {/* Responsive YouTube Embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 max-w-xl">{activeVideo.explanationDarija}</p>
              {activeVideo.url && (
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                >
                  <span>فتح في يوتيوب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
