package com.imamgazali.kimyayisaadet;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Native Android SQLite Database Helper for Kimyâyı Saâdet
 * Persists reading progress, bookmarks, and font/display settings locally.
 */
public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "kimyayi_saadet.db";
    private static final int DATABASE_VERSION = 1;

    // Tables
    public static final String TABLE_PROGRESS = "reading_progress";
    public static final String TABLE_SETTINGS = "user_settings";
    public static final String TABLE_BOOKMARKS = "bookmarks";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // 1. Reading Progress Table
        db.execSQL("CREATE TABLE " + TABLE_PROGRESS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "book_id TEXT DEFAULT 'kimyayi_saadet', " +
                "current_chapter_id INTEGER, " +
                "scroll_offset INTEGER, " +
                "scroll_percent INTEGER, " +
                "last_read_time INTEGER);");

        // 2. Settings Key-Value Table
        db.execSQL("CREATE TABLE " + TABLE_SETTINGS + " (" +
                "setting_key TEXT PRIMARY KEY, " +
                "setting_value TEXT);");

        // 3. Bookmarks Table
        db.execSQL("CREATE TABLE " + TABLE_BOOKMARKS + " (" +
                "id TEXT PRIMARY KEY, " +
                "chapter_id INTEGER, " +
                "paragraph_index INTEGER, " +
                "snippet TEXT, " +
                "timestamp TEXT);");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_PROGRESS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SETTINGS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_BOOKMARKS);
        onCreate(db);
    }

    public void saveProgress(int chapterId, int scrollOffset, int percent) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("book_id", "kimyayi_saadet");
        cv.put("current_chapter_id", chapterId);
        cv.put("scroll_offset", scrollOffset);
        cv.put("scroll_percent", percent);
        cv.put("last_read_time", System.currentTimeMillis());

        // Upsert or single row update
        db.delete(TABLE_PROGRESS, "book_id = ?", new String[]{"kimyayi_saadet"});
        db.insert(TABLE_PROGRESS, null, cv);
    }

    public void saveSetting(String key, String value) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("setting_key", key);
        cv.put("setting_value", value);
        db.insertWithOnConflict(TABLE_SETTINGS, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public String getSetting(String key, String defaultValue) {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_SETTINGS, new String[]{"setting_value"}, "setting_key = ?", new String[]{key}, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            String val = cursor.getString(0);
            cursor.close();
            return val;
        }
        if (cursor != null) cursor.close();
        return defaultValue;
    }
}
