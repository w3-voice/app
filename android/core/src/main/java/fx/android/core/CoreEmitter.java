package fx.android.core;
import android.os.RemoteCallbackList;
import android.os.RemoteException;
import android.util.Log;

import bridge.Emitter;
import bridge.Event;

public class CoreEmitter implements Emitter {
    final RemoteCallbackList<IListener> listeners
            = new RemoteCallbackList<IListener>();

    public void addListener(IListener cb) {
        listeners.register(cb);
    }
    public void removeListener(IListener cb) {
        listeners.unregister(cb);
    }

    @Override
    public void emit(Event event) {
        Log.d("Broadcaster", "broadCast: "+event);
        IEvent evt = new IEvent();
        evt.action = event.getAction();
        evt.group = event.getGroup();
        evt.name = event.getName();
        evt.payload = event.getPayload();
        broadcastEvent(evt);
    }

    private void broadcastEvent(IEvent evt) {
        // Broadcast to all clients the new value.
        final int N = listeners.beginBroadcast();
        for (int i=0; i<N; i++) {
            try {
                listeners.getBroadcastItem(i).emit(evt);
            } catch (RemoteException e) {
                // The RemoteCallbackList will take care of removing
                // the dead object for us.
            }
        }
        listeners.finishBroadcast();
    }
}
