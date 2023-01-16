package com.helloworld.service_manager;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.provider.Settings;

import com.thelittlefireman.appkillermanager.AppKillerManager;
import com.thelittlefireman.appkillermanager.exceptions.NoActionFoundException;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

@ReactModule(name = PermissionsModule.NAME)
public class PermissionsModule extends ReactContextBaseJavaModule {
    public static final String NAME = "PermissionsModule";
    private static final String TAG = NAME;

    public PermissionsModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    @ReactMethod
    public void getState(Promise promise) {
        SharedPreferences sharedPref = getReactApplicationContext()
                .getCurrentActivity()
                .getPreferences(Context.MODE_PRIVATE);
        boolean isAsked = sharedPref.getBoolean("isAsked", false);

        WritableMap map = Arguments.createMap();
        map.putBoolean("supported", AppKillerManager.isDeviceSupported());
        map.putBoolean("autostart", isPowerSavingAvailable());
        map.putBoolean("powersave", isAutoStartAvailable());
        map.putBoolean("optimization", isBatteryOptimizationAvailable());
        map.putBoolean("isAsked", isAsked);
        promise.resolve(map);
    }

    @ReactMethod
    private void openAppBatteryOptimization()
    {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }

    @ReactMethod
    public void doActionAutoStart() {
        try {
            if (AppKillerManager.isDeviceSupported()) {
                AppKillerManager.doActionAutoStart(getReactApplicationContext());
            }
            ;
        } catch (NoActionFoundException ignored) {
        }
    }

    @ReactMethod
    public void doActionPowerSaving() {
        try {
            if (AppKillerManager.isDeviceSupported()) {
                AppKillerManager.doActionPowerSaving(getReactApplicationContext());
            }
            ;
        } catch (NoActionFoundException ignored) {
        }
    }

    @ReactMethod
    public void doneAsking() {
        SharedPreferences sharedPref = getReactApplicationContext()
                .getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean("isAsked", true);
        editor.apply();
    }

    @ReactMethod
    public void openAppInfo() {
        Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.parse("package:" + getReactApplicationContext().getPackageName()));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }

    public boolean isPowerSavingAvailable() {
        return AppKillerManager.isActionAvailable(getReactApplicationContext(), AppKillerManager.Action.ACTION_AUTO_START);
    }

    public boolean isAutoStartAvailable() {
        return AppKillerManager.isActionAvailable(getReactApplicationContext(), AppKillerManager.Action.ACTION_POWER_SAVING);
    }

    public boolean isBatteryOptimizationAvailable() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P)
        {
            ActivityManager am = (ActivityManager)getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
            Boolean isRestricted = am.isBackgroundRestricted();
            if(isRestricted)
            {
               return true;
            }
        }
        return false;
    }
}
