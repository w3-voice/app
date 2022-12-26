package com.helloworld;

import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Intent;

import fx.android.core.CoreService;

public class HoodChatService extends CoreService {

    @Override
    public PendingIntent makeIntent() {
        // Create an Intent for the activity you want to start
        Intent resultIntent = new Intent(this, MainActivity.class);
        // Create the TaskStackBuilder and add the intent, which inflates the back stack
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
        stackBuilder.addNextIntentWithParentStack(resultIntent);
        // Get the PendingIntent containing the entire back stack
        PendingIntent resultPendingIntent =
                stackBuilder.getPendingIntent(0,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        return resultPendingIntent;
    }
}
