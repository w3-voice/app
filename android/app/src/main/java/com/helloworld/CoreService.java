package com.helloworld;

import android.app.Notification;
import android.app.NotificationManager;
//import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;
import mobile.Bee;
import mobile.Mobile;

import com.helloworld.R;

import java.io.File;

public class CoreService extends Service {

    private int NOTIFICATION = R.string.local_service_started;
    Bee core;
    String appDir;
    String storeDirPath;
    String path;
    /**
     * Class for clients to access.  Because we know this service always
     * runs in the same process as its clients, we don't need to deal with
     * IPC.
     */
    public class LocalBinder extends Binder {
        CoreService getService() {
            return CoreService.this;
        }
    }

    @Override
    public void onCreate() {
        Context context = getApplicationContext();
        appDir = context.getFilesDir().toString();
        storeDirPath = appDir + "/bee/received/";
        path = appDir + "/bee";
        File storeDir = new File(storeDirPath);
        boolean success = true;

        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if(success){
            Log.d("CoreService","store folder created");
        }else{
            Log.d("CoreService","can not create folder");
        }
        try {
            this.core = Mobile.newBee(path);
        } catch (Exception e) {
            e.printStackTrace();
            Log.d("CoreService","faild");
        }
        Log.i("CoreService", "Service Sourd stared");
        Toast.makeText(this, "Background Service Created", Toast.LENGTH_LONG).show();
        // Display a notification about us starting.  We put an icon in the status bar.
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
//        mNM = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        Log.i("CoreService", "Received start id " + startId + ": " + intent);
//        Toast.makeText(this, "Background Service Created", Toast.LENGTH_LONG).show();
//        showNotification();
        return START_REDELIVER_INTENT;

    }
    @Override
    public void onDestroy() {
        // Cancel the persistent notification.
//        mNM.cancel(NOTIFICATION);
        // Tell the user we stopped.
        Log.i("CoreService", "core service destoried");
        Toast.makeText(this, R.string.local_service_stopped, Toast.LENGTH_SHORT).show();
    }
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
    // This is the object that receives interactions from clients.  See
    // RemoteService for a more complete example.
    private final IBinder mBinder = new LocalBinder();

}