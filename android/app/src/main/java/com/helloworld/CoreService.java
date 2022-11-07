package com.helloworld;

import android.app.Notification;
import android.app.NotificationManager;
//import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;
import bridge.Bridge;
import bridge.Bridge_;

import com.helloworld.R;

import java.io.File;

public class CoreService extends Service {
    private String NAME = "CoreService";
    private int NOTIFICATION = R.string.local_service_started;
    Bridge_ core;
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
        boolean success = false;
        if (!storeDir.exists()) {
            success = storeDir.mkdirs();
        }
        if(success){
            Log.d(NAME,"store folder created");
        }else{
            Log.d(NAME,"store exist");
        }
        try {
            this.core = Bridge.newBridge(path);
        } catch (Exception e) {
            Log.e(NAME,"failed to start core service", e);
            e.printStackTrace();
        }
        Log.i(NAME, "core service stared");
        Toast.makeText(this, "Background Service Created", Toast.LENGTH_LONG).show();
        // Display a notification about us starting.  We put an icon in the status bar.
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
//        mNM = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        Log.i(NAME, "Received start id " + startId + ": " + intent);
//        Toast.makeText(this, "Background Service Created", Toast.LENGTH_LONG).show();
//        showNotification();
        return START_REDELIVER_INTENT;

    }
    @Override
    public void onDestroy() {
        // Cancel the persistent notification.
//        mNM.cancel(NOTIFICATION);
        // Tell the user we stopped.
        Log.i(NAME, "core service destroyed");
        Toast.makeText(this, R.string.local_service_stopped, Toast.LENGTH_SHORT).show();
    }
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }
    // This is the object that receives interactions from clients.  See
    // RemoteService for a more complete example.
    private final IBinder mBinder = new LocalBinder();

    private final ICoreService.Stub binder = new ICoreService.Stub() {

        public boolean addContact(String id, String name) throws RemoteException {
            try {
                core.addContact(id, name);
                return true;
            } catch (Exception e) {
                Log.e("CoreService", "can not add contact", e);
                return false;
            }
        }

        public String getChat(String id) throws RemoteException {
            try {
                String res = core.getChat(id);
                return res;
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve chat", e);
                return null;
            }
        }

        public String getChats() throws RemoteException {
            try {
                Log.d(NAME, core.getChats());
                return core.getChats();
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve chat list", e);
                return null;
            }
        }

        public String getContact(String id) throws RemoteException {
            try {
                return core.getContact(id);
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve contact", e);
                return null;
            }
        }

        public String getContacts() throws RemoteException {
            try {
                return core.getContacts();
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve contact list", e);
                throw new RemoteException(e.getMessage());
            }
        }

        public String getIdentity() throws RemoteException {
            try {
                return core.getIdentity();
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve identity", e);
                return null;
            }
        }

        public String newIdentity(String name) throws RemoteException {
            try {
                return core.newIdentity(name);
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve identity", e);
                return null;
            }
        }

        public String getMessages(String id) throws RemoteException {
            try {
                return core.getMessages(id);
            } catch (Exception e) {
                Log.e(NAME, "can not retrieve messages", e);
                return null;
            }
        }

        public boolean isLogin() throws RemoteException {
            try {
                return core.isLogin();
            } catch (Exception e) {
                Log.e(NAME, "can not call is login", e);
                return false;
            }
        }

        public String newPMChat(String contactID) throws RemoteException {
            try {
                return core.newPMChat(contactID);
            } catch (Exception e) {
                Log.e(NAME, "failed to create new chat", e);
                return null;
            }
        }

        public String getPMChat(String contactID) throws RemoteException {
            try {
                return core.getPMChat(contactID);
            } catch (Exception e) {
                Log.e(NAME, "failed to create new chat", e);
                return null;
            }
        }

        public String sendMessage(String chatID, String text) throws RemoteException {
            try {
                return core.sendMessage(chatID, text);
            } catch (Exception e) {
                Log.e(NAME, "can not send message", e);
                return null;
            }
        }
    };

}