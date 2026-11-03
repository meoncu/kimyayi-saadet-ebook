package com.imamgazali.kimyayisaadet.compose

data class Chapter(
    val id: Int,
    val sectionTitle: String,
    val title: String,
    val summary: String,
    val paragraphs: List<String>
)

data class ReaderSettings(
    val fontSize: Float = 18f,
    val lineHeight: Float = 1.7f,
    val theme: ReaderTheme = ReaderTheme.SEPIA,
    val fontFamily: String = "serif"
)

enum class ReaderTheme(val label: String, val bgHex: Long, val textHex: Long) {
    WHITE("Gündüz", 0xFFFFFFFF, 0xFF1C1E21),
    SEPIA("Sepya", 0xFFF6F0E2, 0xFF34281D),
    NIGHT("Gece", 0xFF191C20, 0xFFDCE1E8),
    OLED("OLED Siyah", 0xFF000000, 0xFFE6E6E6)
}

data class ReadingProgress(
    val chapterId: Int = 1,
    val scrollPercent: Int = 0,
    val lastReadTimestamp: Long = System.currentTimeMillis()
)
