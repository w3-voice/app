// ICoreServiceCallback.aidl
package fx.android.core;

// Declare any non-default types here with import statements

oneway interface ICoreServiceCallback {
    /**
    * A call back for notifying message change
    */
     void msgChanged(String msgID, String status);
}