package fx.android.core;


import android.content.Context;
import android.os.IInterface;

import androidx.core.app.NotificationManagerCompat;

interface ILocalListener {
    public void onEvent(IEvent event);
}