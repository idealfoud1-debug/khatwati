import React, { useState } from 'react';
import { Smartphone, Code, Layers, Database, Shield, X, Copy, Check } from 'lucide-react';

interface AndroidArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidArchitectureModal: React.FC<AndroidArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'compose' | 'room' | 'media3' | 'sensors'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const composeSnippet = `// KhatwatiApp.kt - Native Jetpack Compose Root Architecture
package com.khatwati.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.khatwati.app.ui.navigation.KhatwatiNavHost
import com.khatwati.app.ui.theme.KhatwatiTheme

@Composable
fun KhatwatiApp() {
    val navController = rememberNavController()
    KhatwatiTheme {
        Scaffold(
            bottomBar = { KhatwatiBottomBar(navController) }
        ) { paddingValues ->
            KhatwatiNavHost(
                navController = navController,
                modifier = Modifier.padding(paddingValues)
            )
        }
    }
}`;

  const roomSnippet = `// KhatwatiDatabase.kt - Room Persistence for 100% Offline (Yabiladi Cache)
package com.khatwati.app.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "yabiladi_prayer_cache", primaryKeys = ["cityId", "prayerDate"])
data class YabiladiPrayerCacheEntity(
    val cityId: String,
    val cityNameArabic: String,
    val prayerDate: String, // YYYY-MM-DD
    val fajr: String,
    val dhuhr: String,
    val asr: String,
    val maghrib: String,
    val isha: String,
    val sourceUrl: String,
    val retrievalTimestamp: String,
    val validationStatus: String = "VALID"
)

@Dao
interface YabiladiPrayerDao {
    @Query("SELECT * FROM yabiladi_prayer_cache WHERE cityId = :cityId AND prayerDate = :date LIMIT 1")
    fun getCachedPrayerTimes(cityId: String, date: String): Flow<YabiladiPrayerCacheEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(cacheItem: YabiladiPrayerCacheEntity)
}

@Database(entities = [YabiladiPrayerCacheEntity::class, PrayerLogEntity::class], version = 2)
abstract class KhatwatiDatabase : RoomDatabase() {
    abstract fun yabiladiPrayerDao(): YabiladiPrayerDao
    abstract fun prayerDao(): PrayerDao
}`;

  const media3Snippet = `// QuranAudioService.kt - AndroidX Media3 / ExoPlayer Service
package com.khatwati.app.service

import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService

class QuranAudioService : MediaSessionService() {
    private var mediaSession: MediaSession? = null
    private lateinit var player: ExoPlayer

    override fun onCreate() {
        super.onCreate()
        player = ExoPlayer.Builder(this).build()
        mediaSession = MediaSession.Builder(this, player).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo) = mediaSession
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 text-right">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 flex flex-col h-[85vh] max-h-[720px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-bold text-base text-white font-ui">
                بنية تطبيق أندرويد الأصلي (Native Android Architecture)
              </h3>
              <span className="text-xs text-emerald-300">
                Kotlin 2.0 · Jetpack Compose · Material 3 · Room · Media3 · DataStore
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'المبادئ المشتركة' },
            { id: 'compose', label: 'واجهة Jetpack Compose' },
            { id: 'room', label: 'قاعدة بيانات Room' },
            { id: 'media3', label: 'مشغل الصوت Media3' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === t.id
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800">
          {activeTab === 'overview' && (
            <div className="space-y-3.5">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                <h4 className="font-bold text-sm text-emerald-900 mb-1">
                  منتج واحد — منصتان متكاملتان (ONE PRODUCT, TWO PLATFORMS)
                </h4>
                <p className="leading-relaxed">
                  تطبيق خطوتي على منصة Web/PWA ومنصة Native Android يشتركان في نفس الهوية البصرية (الزمردي، العاجي، الذهبي)، ونفس هيكل البيانات، وحوكمة المحتوى الديني المعتمد، والتنقل، واللغة (الدارجة المغربية لشرح المفاهيم والعربية المدققة للنصوص الشرعية).
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span>تخزين البيانات Offline</span>
                  </h5>
                  <p className="text-slate-600 text-xs">
                    تطبيق الويب يستخدم IndexedDB و LocalStorage، بينما تطبيق أندرويد يستخدم Room Database و DataStore لنفس النماذج.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>الأمان وحماية المفاتيح</span>
                  </h5>
                  <p className="text-slate-600 text-xs">
                    لا يحتوي كود أندرويد (APK) ولا الويب على مفاتيح سرية، وتتم جميع اتصالات الذكاء الاصطناعي عبر خادم وسيط آمن.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">كود واجهة المستخدم الرئيسية بـ Kotlin Compose:</span>
                <button
                  onClick={() => copyCode(composeSnippet)}
                  className="flex items-center gap-1 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto text-left direction-ltr">
                {composeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'room' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">كيانات قاعدة بيانات Room لـ Android:</span>
                <button
                  onClick={() => copyCode(roomSnippet)}
                  className="flex items-center gap-1 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto text-left direction-ltr">
                {roomSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'media3' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">خدمة تشغيل تلاوة القرآن في الخلفية عبر AndroidX Media3:</span>
                <button
                  onClick={() => copyCode(media3Snippet)}
                  className="flex items-center gap-1 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto text-left direction-ltr">
                {media3Snippet}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
