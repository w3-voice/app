package com.helloworld;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;

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
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;

import java.nio.charset.StandardCharsets;
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
    private EventRelay mHandler;

    public CoreModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);
    }

    private boolean bindRequest() {
        Intent intent = new Intent(getCurrentActivity(), HoodChatService.class);
        return Objects.requireNonNull(getCurrentActivity()).bindService(intent, connection, Context.BIND_ABOVE_CLIENT);
    }

    private void startService() {
        Log.d(TAG, "startService: statrting service");
        Intent intent = new Intent();
        intent.setAction("com.helloworld.Start");
        intent.setPackage(getReactApplicationContext().getPackageName());
        getReactApplicationContext().sendBroadcast(intent);
    }

    // Not working as is should
    private boolean recoverService(int retry) {
        while (retry > 0) {
            if (bindRequest()) {
                Log.d(TAG, "service recovered");
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (cBound) {
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

    public void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private int listenerCount = 0;
    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            mHandler = new EventRelay();
            mHandler.Init(this);
        }
        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            mHandler = null;
        }
    }

    @ReactMethod
    public void startBind(Callback cb) {
        if (cBound) {
            callBack.invoke(true);
            return;
        }
        if (callBack != null) {
            return;
        }
        startService();
        bindRequest();
        callBack = cb;
    }

    @ReactMethod
    public void hasIdentity(Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(cService.isLogin());
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void newIdentity(String name, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.newIdentity(name);
                    if (res == null) {
                        promise.reject(new Error("failed to create"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void newGPChat(String params, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(CoreModule.NAME, params);
                    byte[] bytes = params.getBytes(StandardCharsets.UTF_8);
                    byte[] res = cService.newGPChat(bytes);
                    if (res == null) {
                        promise.reject(new Error("failed to create"));
                    } else {
                        promise.resolve(new String(res, StandardCharsets.UTF_8));
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getIdentity(Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getIdentity();
                    if (res == null) {
                        promise.reject(new Error("failed to get identity"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();

    }

    @ReactMethod
    public void getChats(int skip, int limit, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getChats(skip, limit);
                    if (res == null) {
                        promise.reject(new Error("failed to get Chats"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getContact(String id, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getContact(id);
                    if (res == null) {
                        promise.reject(new Error("fail to fetch contact"));
                        Log.d(CoreModule.NAME, "fail to fetch contact");
                    } else {
                        promise.resolve(res);
                    }
                } catch (RemoteException e) {
                    promise.reject(e);
                }
            }
        }).start();
    }


    @ReactMethod
    public void getChat(String id, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getChat(id);
                    Log.d(CoreModule.NAME, "chat is ready");
                    if (res == null) {
                        promise.reject(new Error("fail to fetch chat"));
                        Log.d(CoreModule.NAME, "fail to fetch chat");
                    } else {
                        promise.resolve(res);
                    }
                } catch (RemoteException e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void newPMChat(String contactID, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.newPMChat(contactID);
                    if (res == null) {
                        promise.reject(new Error("failed to create private chat"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getPMChat(String contactID, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getPMChat(contactID);
                    if (res == null) {
                        promise.reject(new Error("failed to retrieve private chat"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void openPMChat(String contactID, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getPMChat(contactID);
                    if (res != null) {
                        promise.resolve(res);
                        return;
                    }
                    res = cService.newPMChat(contactID);
                    if (res != null) {
                        promise.resolve(res);
                        return;
                    }
                    promise.reject(new Error("failed to open private chat"));
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getMessages(String chatID, int skip, int limit, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getMessages(chatID, skip, limit);
                    if (res == null) {
                        promise.reject(new Error("failed to get messages"));
                    } else {
                        promise.resolve(res);
                    }
                    ;
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getMessage(String id, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getMessage(id);
                    if (res == null) {
                        promise.reject(new Error("failed to get messages"));
                    } else {
                        promise.resolve(res);
                    }
                    ;
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void sendMessage(String chatID, String text, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.sendMessage(chatID, text);
                    promise.resolve(res);
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void getContacts(int skip, int limit, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String res = cService.getContacts(skip, limit);
                    if (res == null) {
                        promise.reject(new Error("failed to get messages"));
                    } else {
                        promise.resolve(res);
                    }
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();
    }

    @ReactMethod
    public void putContact(String id, String name, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Boolean res = cService.putContact(id, name);
                    promise.resolve(res);
                } catch (Exception e) {
                    promise.reject(e);
                }
            }
        }).start();

    }

    @ReactMethod
    public void seen(String id) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                   cService.seen(id);
                } catch (Exception e) {}
            }
        }).start();

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
            cBound = true;
            callBack.invoke(true);
            callBack = null;

            Log.d(CoreModule.NAME, "client connected to service");

        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            Log.d(arg0.getClassName(), "client disconnected");
            if (callBack != null) {
                callBack.invoke(false);
                callBack = null;
            } else {
                cBound = false;
            }
        }

    };

    private final IListener mlistener = new IListener.Stub() {
        /**
         * This is called by the remote service regularly to tell us about
         * new values. Note that IPC calls are dispatched through a thread
         * pool running in each process, so the code executing here will
         * NOT be running in our main thread like most other things -- so,
         * to update the UI, we need to use a Handler to hop over there.
         */
        public void emit(IEvent event) throws RemoteException {
            Log.d(NAME, "event " + event);
            MessageStatusEvent evt = new MessageStatusEvent();
            Message msg = new Message();
            msg.obj = event;
            msg.what = EventRelay.EVT;
            mHandler.handleMessage(msg);
        }
    };


}
