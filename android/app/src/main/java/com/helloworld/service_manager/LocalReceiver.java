package com.helloworld.service_manager;

import static android.app.PendingIntent.FLAG_ONE_SHOT;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;

import com.helloworld.CoreModule;
import com.helloworld.HoodChatService;

public class LocalReceiver extends BroadcastReceiver {
    private static final int REQUEST_CODE = 0;
    private static final String TAG = "LocalReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "onReceive: start of service requested");

        PowerManager.WakeLock wakeLock = ((PowerManager) context.getSystemService(Context.POWER_SERVICE)).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, ":remote");
        wakeLock.acquire(60 * 1L); //It will keep the device awake & register the service within 1 minute time duration.
        context.getPackageManager().setComponentEnabledSetting(new ComponentName(context, HoodChatService.class), PackageManager.COMPONENT_ENABLED_STATE_DEFAULT, PackageManager.DONT_KILL_APP);

        wakeLock.release(); //Don't forget to add this line when using the wakelock

    }

    public void startMainService(Context context) {
        Intent intent = new Intent(context, LocalReceiver.class);
        PendingIntent broadcast = PendingIntent.getBroadcast(context, REQUEST_CODE, intent, PendingIntent.FLAG_IMMUTABLE);
    }
}