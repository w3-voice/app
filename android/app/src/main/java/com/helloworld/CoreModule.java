package com.helloworld;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.RemoteException;
import android.os.SystemClock;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.lang.reflect.*;


@ReactModule(name = CoreModule.NAME)
public class CoreModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "CoreModule";
    ICoreService cService = null;
    boolean cBound = false;

//    private void invoke(String name){
//        Method method = cService.getClass().getMethod(name,);
//    }


    public CoreModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    @ReactMethod(isBlockingSynchronousMethod = true)
    public void startBind() {
        Intent intent = new Intent(getCurrentActivity(), CoreService.class);
        getCurrentActivity().bindService(intent, connection, Context.BIND_AUTO_CREATE);
        Log.d(CoreModule.NAME, "client start bind");
    }

    @ReactMethod
    public void hasIdentity(Promise promise) {
        while (!cBound) {
            SystemClock.sleep(500);
        }
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
    public void getChats(Promise promise) {
        try{
            String res = cService.getChats();
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
    public void getMessages(String chatID,Promise promise) {
        try{
            String res = cService.getMessages(chatID);
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

            promise.reject(new Error("failed to send message"));
            promise.resolve(res);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getContacts(Promise promise) {
        try{
            String res = cService.getContacts();
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
            cService = ICoreService.Stub.asInterface(service);
            Log.d(CoreModule.NAME, "client connected to service");
            cBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            cBound = false;
        }
    };

}
