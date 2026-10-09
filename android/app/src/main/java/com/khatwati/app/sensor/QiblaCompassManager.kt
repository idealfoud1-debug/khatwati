package com.khatwati.app.sensor

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlin.math.*

/**
 * SensorManager integration using Sensor.TYPE_ROTATION_VECTOR for accurate Qibla compass bearing.
 */
class QiblaCompassManager(context: Context) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val rotationSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)

    private val _azimuthFlow = MutableStateFlow(0f)
    val azimuthFlow: StateFlow<Float> = _azimuthFlow

    fun startListening() {
        rotationSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    fun stopListening() {
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_ROTATION_VECTOR) {
            val rotationMatrix = FloatArray(9)
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
            val orientation = FloatArray(3)
            SensorManager.getOrientation(rotationMatrix, orientation)
            val azimuthRad = orientation[0]
            val azimuthDeg = (Math.toDegrees(azimuthRad.toDouble()) + 360) % 360
            _azimuthFlow.value = azimuthDeg.toFloat()
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Calibration monitoring
    }

    companion object {
        fun calculateQiblaAngle(userLat: Double, userLon: Double): Double {
            val kaabaLat = 21.4225
            val kaabaLon = 39.8262

            val phi1 = Math.toRadians(userLat)
            val phi2 = Math.toRadians(kaabaLat)
            val deltaLambda = Math.toRadians(kaabaLon - userLon)

            val y = sin(deltaLambda)
            val x = cos(phi1) * tan(phi2) - sin(phi1) * cos(deltaLambda)

            val qiblaRad = atan2(y, x)
            return (Math.toDegrees(qiblaRad) + 360) % 360
        }
    }
}
