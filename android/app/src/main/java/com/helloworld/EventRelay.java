package com.helloworld;

import android.content.Context;
import android.os.Handler;
import android.os.Message;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;

import fx.android.core.IEvent;

public class EventRelay extends Handler  {
        public static final int EVT = 0;
        private final WeakReference<CoreModule> weakCoreModule;

        EventRelay(CoreModule coreModule) {
            weakCoreModule = new WeakReference<CoreModule>(coreModule);
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
                    params.putString("payload", object.payload);
                    params.putString("group", object.group);
                    coreModule.sendEvent("CoreEvents", params);
                }
            } else {
                super.handleMessage(msg);
            }
        }

}