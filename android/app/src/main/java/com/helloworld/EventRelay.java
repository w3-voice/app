package com.helloworld;

import android.os.Handler;
import android.os.Message;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;

import fx.android.core.IEvent;

public class EventRelay extends Handler  {
        public static final int EVT = 0;
        private WeakReference<CoreModule> weakCoreModule;

        public void Init(CoreModule coreModule) {
            weakCoreModule = new WeakReference<CoreModule>(coreModule);
        }

        @Override
        public void handleMessage(Message msg) {
            if (msg.what == EVT) {
                CoreModule coreModule = weakCoreModule.get();
                IEvent object = (IEvent) msg.obj;
                if (coreModule != null) {
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
