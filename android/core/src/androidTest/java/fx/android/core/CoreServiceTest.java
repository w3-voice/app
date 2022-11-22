package fx.android.core;


import android.util.Log;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.SmallTest;

import org.junit.Test;
import org.junit.runner.RunWith;

import bridge.Bridge;
import bridge.Debug;
import bridge.HostConfig;


@SmallTest
@RunWith(AndroidJUnit4.class)
public class CoreServiceTest {
    private static final String NAME = "TestCore";
    private static final String TAG = NAME;

    @Test
    public void testNetDriver() throws Exception {
        Log.i(NAME, "core service stared");
        HostConfig hostConfig = Bridge.newHostConfig();
        // set net driver
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            NetDriver inet = new NetDriver();
            hostConfig.setNetDriver(inet);
        }
        Debug d = Bridge.newDebug(hostConfig);
        String s = d.getInterfaces();
        Log.d(TAG, "testNetDriver: " + s);

    }
}
