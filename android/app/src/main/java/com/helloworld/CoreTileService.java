package com.helloworld;

import android.content.Intent;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.service.quicksettings.Tile;
import android.service.quicksettings.TileService;
import android.util.Log;

import androidx.annotation.RequiresApi;


@RequiresApi(api = Build.VERSION_CODES.N)
public class CoreTileService extends TileService {
  private static final String TAG = "Tile Service";
  private boolean enabled = false;
  public class StateModel {
    final boolean enabled;
    final String label;
    final Icon icon;

    public StateModel(boolean e, String l, Icon i) {
      enabled = e;
      label = l;
      icon = i;
    }
  }


  // Called when the user adds your tile.
  @Override
  public void onTileAdded() {
    super.onTileAdded();
  }

  // Called when your app can update your tile.
  @Override
  public void onStartListening() {
    Log.d(TAG, "onStartListening:  do i need something");
    super.onStartListening();
  }

  // Called when your app can no longer update your tile.
  @Override
  public void onStopListening() {
    super.onStopListening();
  }

  // Called when the user taps on your tile in an active or inactive state.
  private boolean stall = false;
  @Override
  public void onClick() {
    if (stall){
      return;
    }
    stall = true;
    Tile tile = getQsTile();

    Intent intent = new Intent(getApplicationContext(), HoodChatService.class);
    if(tile.getState() == Tile.STATE_INACTIVE){
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        getApplicationContext().startForegroundService(intent);
      }else{
        getApplicationContext().startService(intent);
      }
    }else {
      getApplicationContext().stopService(intent);
    }
    tile.setState(tile.getState() == Tile.STATE_INACTIVE ? Tile.STATE_ACTIVE : Tile.STATE_INACTIVE);
    tile.updateTile();
    super.onClick();
    stall = false;
  }

  // Called when the user removes your tile.
  @Override
  public void onTileRemoved() {
    super.onTileRemoved();
  }
}
