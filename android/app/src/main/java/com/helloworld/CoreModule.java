package com.helloworld;


import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;

import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.os.RemoteException;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.lang.ref.WeakReference;
import java.util.Objects;

import fx.android.core.ICoreService;
import fx.android.core.IListener;
import fx.android.core.IEvent;


@ReactModule(name = CoreModule.NAME)
public class CoreModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "CoreModule";
    private static final String TAG = NAME;
    ICoreService cService = null;
    Callback callBack = null;
    boolean cBound = false;
    final Handler timeoutHandler = new Handler(Looper.getMainLooper());
    ReactApplicationContext context = null;
    private InternalHandler mHandler;
    public CoreModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);
        context = reactContext;
    }

    private boolean bindRequest(){
        Intent intent = new Intent(getCurrentActivity(), HoodChatService.class);
        return Objects.requireNonNull(getCurrentActivity()).bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    private void startService() {
        Intent intent = new Intent(getCurrentActivity(), HoodChatService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startService(intent);
        }else{
            context.startService(intent);
        }
    }

    private boolean recoverService(int retry) {
        while (retry>0) {
            if (bindRequest()) {
                Log.d(TAG, "service recovered");
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if(cBound){
                    return true;
                }
            }
            Log.d(TAG, "start service try: " + retry);
            startService();

            retry -= 1;
        }
        return false;

    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @ReactMethod
    public void startBind(Callback cb) {
        mHandler = new InternalHandler(this);
        bindRequest();
        callBack = cb;
        timeoutHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if(!cBound){
                    recoverService(5);
                }
            }
        }, 500);

    }

    @ReactMethod
    public void hasIdentity(Promise promise) {
        try {
            promise.resolve(cService.isLogin());
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    @ReactMethod
    public void newIdentity(String name,Promise promise) {
        try{
            String res = cService.newIdentity(name);
            if(res == null) {
                promise.reject(new Error("failed to create"));
            } else {
                promise.resolve(res);
            }
        }catch (Exception e){
            promise.reject(e);
        }

    }

    @ReactMethod
    public void getIdentity(Promise promise) {
        try{
            String res = cService.getIdentity();
            if(res == null) {
                promise.reject(new Error("failed to get identity"));
            } else {
                promise.resolve(res);
            }
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getChats(int skip, int limit, Promise promise) {
        try{
            String res = cService.getChats(skip, limit);
            if(res == null) {
                promise.reject(new Error("failed to get Chats"));
            } else {
                promise.resolve(res);
            }
        }catch (Exception e){
            promise.reject(e);
        }
    }
    @ReactMethod
    public void getChat(String id, Promise promise) {
        try{
            String res = cService.getChat(id);
            Log.d(CoreModule.NAME, "chat is ready");
            if(res == null) {
                promise.reject(new Error("fail to fetch chat"));
                Log.d(CoreModule.NAME, "fail to fetch chat");
            } else {
                promise.resolve(res);
            }
        }catch (RemoteException e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void newPMChat(String contactID, Promise promise) {
        try{
            String res = cService.newPMChat(contactID);
            if(res == null) {
                promise.reject(new Error("failed to create private chat"));
            } else {
                promise.resolve(res);
            }
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getPMChat(String contactID, Promise promise) {
        try{
            String res = cService.getPMChat(contactID);
            if(res == null) {
                promise.reject(new Error("failed to create private chat"));
            } else {
                promise.resolve(res);
            }
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getMessages(String chatID,int skip, int limit,Promise promise) {
        try{
            String res = cService.getMessages(chatID,skip, limit);
            if(res == null) {
                promise.reject(new Error("failed to get messages"));
            } else {
                promise.resolve(res);
            };
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getMessage(String id,Promise promise) {
        try{
            String res = cService.getMessage(id);
            if(res == null) {
                promise.reject(new Error("failed to get messages"));
            } else {
                promise.resolve(res);
            };
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendMessage(String chatID, String text,Promise promise) {
        try{
            String res = cService.sendMessage(chatID, text);
            promise.resolve(res);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getContacts(int skip, int limit, Promise promise) {
        try{
            String res = cService.getContacts(skip, limit);
            if(res == null) {
                promise.reject(new Error("failed to get messages"));
            } else {
                promise.resolve(res);
            };
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void addContact(String id, String name, Promise promise) {
        try{
            Boolean res = cService.addContact(id, name);
            promise.resolve(res);
        }catch (Exception e){
            promise.reject(e);
        }
    }



    @Override
    public void onHostResume() {
        // Activity `onResume`
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
    }

    @Override
    public void onHostDestroy() {
        // Activity `onDestroy`
    }

    /**
     * Defines callbacks for service binding, passed to bindService()
     */
    private final ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            Log.d(className.getClassName(), "bind connected");
            cService = (ICoreService) ICoreService.Stub.asInterface(service);

            try {
                cService.registerListener(mlistener);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callBack.invoke(true);
            callBack = null;
            Log.d(CoreModule.NAME, "client connected to service");
            cBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            Log.d(arg0.getClassName(), "client disconnected");
            if (callBack != null){
                callBack.invoke(false);
                callBack = null;
            } else {
                cBound = recoverService(5);
            }
        }

    };

    private final IListener mlistener = new IListener.Stub() {
        /**
         * This is called by the remote service regularly to tell us about
         * new values.  Note that IPC calls are dispatched through a thread
         * pool running in each process, so the code executing here will
         * NOT be running in our main thread like most other things -- so,
         * to update the UI, we need to use a Handler to hop over there.
         */
        public void emit(IEvent event) throws RemoteException {
            Log.d(NAME, "event " + event);
            MessageStatusEvent evt = new MessageStatusEvent();
            Message msg = new Message();
            msg.obj=event;
            msg.what=EVT;
            mHandler.handleMessage(msg);

        }
    };
    private static final int EVT=0;
    private static class InternalHandler extends Handler {

        private final WeakReference<CoreModule> weakCoreModule;

        InternalHandler(CoreModule coreModule) {
            weakCoreModule = new WeakReference<>(coreModule);
        }

        @Override
        public void handleMessage(Message msg) {
            if (msg.what == EVT) {
                CoreModule coreModule = weakCoreModule.get();
                if (coreModule != null) {
                    IEvent object = (IEvent) msg.obj;
                    WritableMap params = Arguments.createMap();
                    params.putString("name", object.name);
                    params.putString("action", object.action);
                    params.putString("payload",object.payload);
                    params.putString("group",object.group);
                    coreModule.sendEvent(coreModule.context, "CoreEvents", params);
                }
            } else {
                super.handleMessage(msg);
            }
        }
    }


}
