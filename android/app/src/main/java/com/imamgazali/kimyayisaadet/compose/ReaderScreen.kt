package com.imamgazali.kimyayisaadet.compose

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReaderScreen(
    chapter: Chapter,
    settings: ReaderSettings,
    onFontSizeChange: (Float) -> Unit,
    onThemeChange: (ReaderTheme) -> Unit,
    onNextChapter: () -> Unit,
    onPrevChapter: () -> Unit,
    onOpenToc: () -> Unit
) {
    val listState = rememberLazyListState()
    var showSettingsSheet by remember { mutableStateOf(false) }

    val bgColor = Color(settings.theme.bgHex)
    val textColor = Color(settings.theme.textHex)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = chapter.sectionTitle,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = textColor.copy(alpha = 0.7f)
                        )
                        Text(
                            text = "${chapter.id}. ${chapter.title}",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onOpenToc) {
                        Icon(Icons.Default.Menu, contentDescription = "Fihrist", tint = textColor)
                    }
                },
                actions = {
                    IconButton(onClick = { showSettingsSheet = true }) {
                        Icon(Icons.Default.Settings, contentDescription = "Yazı Ayarları", tint = textColor)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = bgColor)
            )
        },
        bottomBar = {
            Surface(
                color = bgColor,
                tonalElevation = 4.dp,
                modifier = Modifier.fillMaxWidth().height(56.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IconButton(onClick = onPrevChapter, enabled = chapter.id > 1) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Önceki", tint = textColor)
                    }

                    // Font Stepper
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.background(Color.Black.copy(alpha = 0.05f), MaterialTheme.shapes.small)
                    ) {
                        IconButton(onClick = { onFontSizeChange(settings.fontSize - 1f) }) {
                            Text("A−", fontWeight = FontWeight.Bold, color = textColor)
                        }
                        Text(
                            text = "${settings.fontSize.toInt()}sp",
                            fontSize = 12.sp,
                            color = textColor,
                            modifier = Modifier.padding(horizontal = 4.dp)
                        )
                        IconButton(onClick = { onFontSizeChange(settings.fontSize + 1f) }) {
                            Text("A+", fontWeight = FontWeight.Bold, color = textColor)
                        }
                    }

                    IconButton(onClick = onNextChapter) {
                        Icon(Icons.Default.ArrowForward, contentDescription = "Sonraki", tint = textColor)
                    }
                }
            }
        },
        containerColor = bgColor
    ) { innerPadding ->
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 20.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "${chapter.id}. Bölüm",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = chapter.title,
                    fontSize = (settings.fontSize + 6).sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = textColor,
                    lineHeight = ((settings.fontSize + 6) * 1.3f).sp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
                if (chapter.summary.isNotEmpty()) {
                    Surface(
                        color = Color.Black.copy(alpha = 0.04f),
                        shape = MaterialTheme.shapes.small,
                        modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp)
                    ) {
                        Text(
                            text = "“${chapter.summary}”",
                            fontSize = (settings.fontSize - 2).sp,
                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                            color = textColor.copy(alpha = 0.8f),
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }

            // Paragraphs (Continuous Vertical Scroll)
            itemsIndexed(chapter.paragraphs) { _, paragraphText ->
                Text(
                    text = paragraphText,
                    fontSize = settings.fontSize.sp,
                    lineHeight = (settings.fontSize * settings.lineHeight).sp,
                    color = textColor,
                    fontFamily = if (settings.fontFamily == "serif") FontFamily.Serif else FontFamily.Default,
                    textAlign = TextAlign.Justify,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            item {
                Spacer(modifier = Modifier.height(40.dp))
            }
        }

        // Font & Display Settings Bottom Sheet
        if (showSettingsSheet) {
            ModalBottomSheet(
                onDismissRequest = { showSettingsSheet = false },
                containerColor = bgColor
            ) {
                Column(modifier = Modifier.padding(20.dp).fillMaxWidth()) {
                    Text("Yazı Boyutu: ${settings.fontSize.toInt()}sp", fontWeight = FontWeight.Bold, color = textColor)
                    Slider(
                        value = settings.fontSize,
                        onValueChange = onFontSizeChange,
                        valueRange = 14f..32f,
                        steps = 17
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Okuma Teması", fontWeight = FontWeight.Bold, color = textColor)
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        ReaderTheme.values().forEach { theme ->
                            FilterChip(
                                selected = settings.theme == theme,
                                onClick = { onThemeChange(theme) },
                                label = { Text(theme.label) }
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }
        }
    }
}
