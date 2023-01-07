package com.helloworld.service_manager;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.PowerManager;

import com.helloworld.HoodChatService;

public class LocalReceiver extends BroadcastReceiver {


    private static final int REQUEST_CODE = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        PowerManager.WakeLock wakeLock = ((PowerManager) context.getSystemService(Context.POWER_SERVICE)).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, ":remote");
        wakeLock.acquire(60 * 1L); //It will keep the device awake & register the service within 1 minute time duration.
        context.getPackageManager().setComponentEnabledSetting(new ComponentName(context, HoodChatService.class), PackageManager.COMPONENT_ENABLED_STATE_DEFAULT, PackageManager.DONT_KILL_APP);

        startService(context); //Play your audio here.

        wakeLock.release(); //Don't forget to add this line when using the wakelock
    }

    public void startMainService(Context context) {
        PendingIntent broadcast = PendingIntent.getBroadcast(context, REQUEST_CODE, new Intent(context, LocalReceiver.class), PendingIntent.FLAG_IMMUTABLE);
    }

    private void startService(Context context) {
        Intent intent = new Intent(context, HoodChatService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }

}