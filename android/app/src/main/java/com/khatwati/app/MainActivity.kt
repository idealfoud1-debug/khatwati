package com.khatwati.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.khatwati.app.ui.KhatwatiApp
import com.khatwati.app.ui.theme.KhatwatiTheme

/**
 * Khatwati (خطوتي نحو الصلاة والقرآن)
 * Native Android Main Entry Activity.
 * Designed with Kotlin 2.0+ and Jetpack Compose.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            KhatwatiTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    KhatwatiApp()
                }
            }
        }
    }
}
