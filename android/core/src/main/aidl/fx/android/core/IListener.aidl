// IEmitter.aidl
package fx.android.core;

// Declare any non-default types here with import statements
import fx.android.core.IEvent;


oneway interface IEmitter {
    /**
    * A call back for notifying message change
    */
     void emit(IEvent event);
}