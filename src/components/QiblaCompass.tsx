import React, { useState, useEffect } from 'react';
import { PRESET_CITIES, calculateQiblaBearing } from '../services/prayerTimesService';
import { CityLocation } from '../types';
import { Compass, RotateCw, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';

interface QiblaCompassProps {
  onClose?: () => void;
  defaultCity?: CityLocation;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  onClose,
  defaultCity = PRESET_CITIES[0],
}) => {
  const [city, setCity] = useState<CityLocation>(defaultCity);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [sensorStatus, setSensorStatus] = useState<'IDLE' | 'ACTIVE' | 'DENIED' | 'UNSUPPORTED'>('IDLE');
  const [calibrationNeeded, setCalibrationNeeded] = useState(false);

  // Exact mathematical bearing from selected city to Kaaba
  const qiblaBearing = calculateQiblaBearing(city.coords.latitude, city.coords.longitude);

  useEffect(() => {
    // Check if DeviceOrientation is available
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        if ('webkitCompassHeading' in e && typeof (e as any).webkitCompassHeading === 'number') {
          // iOS Safari compass heading (0 = North)
          heading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          // Android standard orientation (alpha increases counter-clockwise)
          heading = (360 - e.alpha) % 360;
        }

        if (heading !== null) {
          setDeviceHeading(Math.round(heading));
          setSensorStatus('ACTIVE');
        }
      };

      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    } else {
      setSensorStatus('UNSUPPORTED');
    }
  }, []);

  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setSensorStatus('ACTIVE');
        } else {
          setSensorStatus('DENIED');
        }
      } catch (err) {
        setSensorStatus('DENIED');
      }
    }
  };

  // Effective user heading (sensor or manual slider)
  const currentHeading = deviceHeading !== null ? deviceHeading : manualHeading;
  // Needle rotation towards Qibla relative to phone top
  const needleAngle = (qiblaBearing - currentHeading + 360) % 360;
  // Is aligned within +/- 5 degrees?
  const isAligned = needleAngle <= 5 || needleAngle >= 355;

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-6 shadow-sm text-right relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-5 h-5 text-emerald-800" />
        <h3 className="text-lg font-bold text-emerald-950 font-ui">بوصلة القبلة المشرفة</h3>
      </div>
      <p className="text-xs text-slate-600 mb-4">
        تحديد الاتجاه الرياضي الدقيق نحو الكعبة المشرفة بمكة المكرمة بالاعتماد على إحداثيات موقعك.
      </p>

      {/* City selector for coordinates */}
      <div className="mb-6 flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-700">الموقع المعتمد:</label>
        <select
          aria-label="اختر المدينة لحساب القبلة"
          value={city.id}
          onChange={(e) => {
            const found = PRESET_CITIES.find((c) => c.id === e.target.value);
            if (found) setCity(found);
          }}
          className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
        >
          {PRESET_CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameArabic} ({c.country}) — زاوية {Math.round(calculateQiblaBearing(c.coords.latitude, c.coords.longitude))}°
            </option>
          ))}
        </select>
      </div>

      {/* Compass Dial Display */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative w-64 h-64 rounded-full border-4 border-emerald-900/20 bg-slate-50 shadow-inner flex items-center justify-center">
          {/* Degree ticks */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-300" />

          {/* North, South, East, West labels */}
          <span className="absolute top-2 text-[11px] font-bold text-red-600">الشمال (N)</span>
          <span className="absolute bottom-2 text-[11px] font-bold text-slate-500">الجنوب (S)</span>
          <span className="absolute right-2 text-[11px] font-bold text-slate-500">الشرق (E)</span>
          <span className="absolute left-2 text-[11px] font-bold text-slate-500">الغرب (W)</span>

          {/* Qibla Needle */}
          <div
            className="absolute w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${needleAngle}deg)` }}
          >
            {/* Kaaba indicator icon at the pointer tip */}
            <div className="absolute top-4 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-xs font-bold transition-colors ${
                  isAligned ? 'bg-amber-400 text-emerald-950 scale-110 animate-bounce' : 'bg-emerald-800 text-amber-300'
                }`}
                title="الكعبة المشرفة"
              >
                🕋
              </div>
              <div className="w-1.5 h-16 bg-gradient-to-t from-emerald-600 to-amber-400 rounded-full mt-1" />
            </div>

            {/* Pivot Center */}
            <div className="w-5 h-5 rounded-full bg-emerald-950 border-2 border-amber-300 z-10 shadow-xs" />
          </div>

          {/* Current Degree Center Readout */}
          <div className="absolute bottom-16 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 text-center shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-900 tabular-nums">
              {Math.round(qiblaBearing)}° نحو مكة
            </span>
          </div>
        </div>

        {/* Alignment status alert */}
        <div className="mt-4 text-center">
          {isAligned ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-300 animate-pulse">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>أنت تواجه القبلة المشرفة الآن تماماً! تقبل الله.</span>
            </div>
          ) : (
            <span className="text-xs text-slate-600">
              قم بتدوير الجهاز حتى تتجه علامة الكعبة 🕋 للأعلى تماماً.
            </span>
          )}
        </div>
      </div>

      {/* Sensor Status / Manual Slider Fallback */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3">
        {sensorStatus === 'ACTIVE' ? (
          <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>مستشعر البوصلة نشط ويتفاعل مع دوران هاتفك تلقائياً.</span>
            </div>
            <button
              onClick={() => setCalibrationNeeded(!calibrationNeeded)}
              className="text-[11px] underline text-emerald-900 cursor-pointer"
            >
              معايرة المستشعر
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">تدوير البوصلة يدوياً (للحواسيب والأجهزة بدون مستشعر):</span>
              {typeof DeviceOrientationEvent !== 'undefined' && (
                <button
                  onClick={requestOrientationPermission}
                  className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
                >
                  طلب إذن المستشعر
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono tabular-nums w-12 text-left">{manualHeading}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={manualHeading}
                onChange={(e) => setManualHeading(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>
        )}

        {calibrationNeeded && (
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>طريقة معايرة المستشعر المغناطيسي:</span>
            </div>
            <p>
              ارسم بهاتفك في الهواء حركة رقم <strong>8</strong> بالإنجليزي ثلاث مرات بعيداً عن الأجهزة الإلكترونية والمعادن الكبيرة لضبط دقة المستشعر.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
