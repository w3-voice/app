package fx.android.core;
import android.os.RemoteCallbackList;
import android.os.RemoteException;
import android.util.Log;

import bridge.Emitter;
import bridge.Event;

public class CoreEmitter implements Emitter {
    final RemoteCallbackList<ICoreServiceCallback> mCallbacks
            = new RemoteCallbackList<ICoreServiceCallback>();

    public void register(ICoreServiceCallback cb) {
        mCallbacks.register(cb);
    }
    public void unregister(ICoreServiceCallback cb) {
        mCallbacks.unregister(cb);
    }

    @Override
    public void broadCast(Event event) {
        Log.d("Broadcaster", "broadCast: "+event.getMsgID());
        broadcastMessageStatus(event.getMsgID(), event.getStatus());
    }

    private void broadcastMessageStatus(String id, String status) {
        // Broadcast to all clients the new value.
        final int N = mCallbacks.beginBroadcast();
        for (int i=0; i<N; i++) {
            try {
                mCallbacks.getBroadcastItem(i).msgChanged(id, status);
            } catch (RemoteException e) {
                // The RemoteCallbackList will take care of removing
                // the dead object for us.
            }
        }
        mCallbacks.finishBroadcast();
    }
}
