// IListener.aidl
package fx.android.core;

// Declare any non-default types here with import statements
import fx.android.core.IEvent;


oneway interface IListener {
    /**
    * A call back for notifying message change
    */
     void emit(in IEvent event);
}