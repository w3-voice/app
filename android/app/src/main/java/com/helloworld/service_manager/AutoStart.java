package com.helloworld.service_manager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.helloworld.HoodChatService;

public class AutoStart extends BroadcastReceiver {
    private static final String TAG = "AutoStart";
    LocalReceiver localReceiver = new LocalReceiver();

    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED) || intent.getAction().equals("com.helloworld.Start")) {
            Log.d(TAG, "onReceive: calling local receiver");
            Intent intent2 = new Intent(context, HoodChatService.class);
            if (Build.VERSION.SDK_INT >= 26)
                context.startForegroundService(intent2);
            else
                context.startService(intent2);
            localReceiver.startMainService(context); //It will create a receiver to receive the broadcast & start your service in it's `onReceive()`.
        }
    }

}