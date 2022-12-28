package fx.android.core;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.Message;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import bridge.Bridge;
import bridge.Bridge_;
import bridge.Emitter;
import bridge.HostConfig;
import bridge.Notification;

import org.json.*;

public class CoreService extends Service {
    private static CoreService instance = null;
    private static final String TAG = "CoreService";
    private final String NAME = "CoreService";
    private final String CHANNEL_ID = "111";
    private final String VERSION = "0.0.3";
    private boolean inited = false;
    int notificationId = 12;
    private Bridge_ core = null;
    String appDir;
    String storeDirPath;
    String path;
    final CoreEmitter emitter = new CoreEmitter();

    public static boolean isServiceCreated() {
        return instance != null;
    }

    public boolean healthCheck() {
        try {
            if (instance != null && core != null) {
                core.isLogin();
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    private final ILocalListener mlistener = event -> {
        try {
            Log.i(TAG, ": notification called");
            showMessageNotification(event.payload);
        } catch (Exception e) {
            Log.e(TAG, ": notification failed", e);
            e.printStackTrace();
        }
    };

    public PendingIntent makeIntent() {
        return null;
    }


    private void init() {
        while(!healthCheck()){
            createHost();

        }
        emitter.setLocalListener(mlistener);
        createNotificationChannel();
        inited = false;
    }


    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.i("IsolatedService", "Task removed in " + this + ": " + rootIntent);
        core.stop();
        stopSelf();
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getString(R.string.channel_name);
            String description = getString(R.string.channel_description);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }


    private synchronized void createHost() {
        Context context = getApplicationContext();
        appDir = context.getFilesDir().toString();
        storeDirPath = appDir + "/bee/received/";
        path = appDir + "/bee";
        File storeDir = new File(storeDirPath);
        boolean success = false;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if (success) {
            Log.d(NAME, "store folder created");
        } else {
            Log.d(NAME, "store exist");
        }
        try {
            Log.i(NAME, "core service stared");
            HostConfig hostConfig = Bridge.newHostConfig();
            // set net driver
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                NetDriver inet = new NetDriver();
                hostConfig.setNetDriver(inet);
            }
            hostConfig.setBroadCaster(emitter);
            this.core = Bridge.newBridge(path, hostConfig);
            String s1 = this.core.getInterfaces();
            Log.d(NAME, "driver" + s1);
        } catch (Exception e) {
            this.core = null;
            Log.e(NAME, "failed to start core service", e);
            e.printStackTrace();
        }
    }

    public void showMessageNotification(String msgID) throws Exception {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        Notification n = core.getMessageNotification(msgID);
        Log.i(TAG, "showMessageNotification: " + n.getText() + " " + n.getTitle());
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_onesignal_default)
                .setContentTitle(n.getTitle())
                .setContentText(n.getText())
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        PendingIntent p = makeIntent();
        if (p != null) {
            builder.setContentIntent(p);
        }
        notificationManager.notify(notificationId, builder.build());
        notificationId += 1;
    }

    public void showServiceNotification() {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_onesignal_default)
                .setContentTitle("HoodChat")
                .setContentText("background service")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        PendingIntent p = makeIntent();
        if (p != null) {
            builder.setContentIntent(p);
        }
        startForeground(1, builder.build());
    }

    @Override
    public void onCreate() {
        if (!inited && instance == null) {
            super.onCreate();
            instance = this;
            init();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (!inited) {
            init();
        }
        showServiceNotification();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.i(NAME, "core service destroyed");
        core.stop();
        instance = null;
        Toast.makeText(this, R.string.local_service_stopped, Toast.LENGTH_SHORT).show();
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.i(NAME, "client requested for bind");
        return binder;
    }



    // Core API service for isolated service
    private final ICoreService.Stub binder = new ICoreService.Stub() {

        private boolean handleCoreException(boolean type, Exception e, String msg){
            Log.e("CoreService", msg, e);
            if (!healthCheck()){
                init();
            }
            return  type;
        }


        private String handleCoreException(String type, Exception e, String msg){
            Log.e("CoreService", msg, e);
            if (!healthCheck()){
                init();
            }
            return type;
        }

        public void registerListener(IListener cb) {
            if (cb != null) emitter.addListener(cb);
        }

        public void unregisterListener(IListener cb) {
            if (cb != null) emitter.removeListener(cb);
        }

        public boolean addContact(String id, String name) throws RemoteException {
            try {
                core.addContact(id, name);
                return true;
            } catch (Exception e) {
                return handleCoreException(false, e,"can not add contact");
            }
        }

        public String getChat(String id) throws RemoteException {
            try {
                return core.getChat(id);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve chat");
            }
        }

        public String getChats(int skip, int limit) throws RemoteException {
            try {
                return core.getChats(skip, limit);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve chat");
            }
        }

        public String getContact(String id) throws RemoteException {
            try {
                return core.getContact(id);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve contact");
            }
        }

        public String getContacts(int skip, int limit) throws RemoteException {
            try {
                return core.getContacts(skip, limit);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve contact list");
            }
        }

        public String getIdentity() throws RemoteException {
            try {
                return core.getIdentity();
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve identity");
            }
        }

        public String newIdentity(String name) throws RemoteException {
            try {
                return core.newIdentity(name);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve create identity");
            }
        }

        public String getMessages(String chatID, int skip, int limit) throws RemoteException {
            try {
                return core.getMessages(chatID, skip, limit);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve message list");
            }
        }

        public String getMessage(String id) throws RemoteException {
            try {
                return core.getMessage(id);
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve messages", e);
                return handleCoreException(null, e,"failed to retrieve message");
            }
        }

        public boolean isLogin() throws RemoteException {
            try {
                return core.isLogin();
            } catch (Exception e) {
                return handleCoreException(false, e,"failed to check login");
            }
        }

        public String newPMChat(String contactID) throws RemoteException {
            try {
                return core.newPMChat(contactID);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to create new private chat");
            }
        }

        public String getPMChat(String contactID) throws RemoteException {
            try {
                return core.getPMChat(contactID);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to retrieve private chat");
            }
        }

        public String sendMessage(String chatID, String text) throws RemoteException {
            Log.d(NAME, "send called");
            try {
                return core.sendMessage(chatID, text);
            } catch (Exception e) {
                return handleCoreException(null, e,"failed to send private message");
            }
        }
    };

}