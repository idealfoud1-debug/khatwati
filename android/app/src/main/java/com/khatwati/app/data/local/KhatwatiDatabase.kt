package com.khatwati.app.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

/**
 * Room Database entities & DAOs for Khatwati Native Android
 * Preserves 100% offline consistency matching the Web/PWA IndexedDB model.
 * Updated to integrate Yabiladi prayer times cache architecture.
 */

@Entity(
    tableName = "yabiladi_prayer_cache",
    primaryKeys = ["cityId", "prayerDate"]
)
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

@Entity(tableName = "prayer_logs")
data class PrayerLogEntity(
    @PrimaryKey val date: String,
    val fajr: Boolean = false,
    val dhuhr: Boolean = false,
    val asr: Boolean = false,
    val maghrib: Boolean = false,
    val isha: Boolean = false
)

@Entity(tableName = "quran_bookmarks")
data class QuranBookmarkEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val surahNumber: Int,
    val ayahNumber: Int,
    val surahName: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface YabiladiPrayerDao {
    @Query("SELECT * FROM yabiladi_prayer_cache WHERE cityId = :cityId AND prayerDate = :date LIMIT 1")
    fun getCachedPrayerTimes(cityId: String, date: String): Flow<YabiladiPrayerCacheEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(cacheItem: YabiladiPrayerCacheEntity)

    @Query("DELETE FROM yabiladi_prayer_cache WHERE prayerDate < :cutoffDate")
    suspend fun clearExpiredCache(cutoffDate: String)
}

@Dao
interface PrayerDao {
    @Query("SELECT * FROM prayer_logs WHERE date = :date")
    fun getPrayerLogForDate(date: String): Flow<PrayerLogEntity?>

    @Query("SELECT * FROM prayer_logs ORDER BY date DESC LIMIT 7")
    fun getPastWeekLogs(): Flow<List<PrayerLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(log: PrayerLogEntity)

    @Query("DELETE FROM prayer_logs WHERE date = :date")
    suspend fun deleteForDate(date: String)
}

@Dao
interface QuranBookmarkDao {
    @Query("SELECT * FROM quran_bookmarks ORDER BY createdAt DESC")
    fun getAllBookmarks(): Flow<List<QuranBookmarkEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addBookmark(bookmark: QuranBookmarkEntity)

    @Delete
    suspend fun removeBookmark(bookmark: QuranBookmarkEntity)
}

@Database(
    entities = [
        YabiladiPrayerCacheEntity::class,
        PrayerLogEntity::class,
        QuranBookmarkEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class KhatwatiDatabase : RoomDatabase() {
    abstract fun yabiladiPrayerDao(): YabiladiPrayerDao
    abstract fun prayerDao(): PrayerDao
    abstract fun quranBookmarkDao(): QuranBookmarkDao
}
