// ICoreService.aidl
package fx.android.core;

import fx.android.core.IListener;

// Declare any non-default types here with import statements


// So everything work with base64 json strings.

interface ICoreService {
    /**
    * get chat info
    */
    String getChat(String id);
    /**
    * get list of chat info
    */
    String getChats(int skip, int limit);
    /**
    * add new contact
    */
    boolean putContact(String id, String name);
    /**
    * get contact info
    */
    String getContact(String id);
    /**
    * get all contact info
    */
    String getContacts(int skip, int limit);
    /**
    * get identity
    */
    String getIdentity();
    /**
    * create new identity
    */
    String newIdentity(String name);
    /**
    * get all messages for a chat
    */
    String getMessages(String chatID,int skip, int limit);
    /**
    * get message by id
    */
    String getMessage(String id);
    /**
    * return true if user is already generate identity
    */
    boolean isLogin();
    /**
    * create a new Private Chat with id of contact and ChatID
    */
    String newPMChat(String contactID);
    /**
    * retrun a Private chat by its contactID
    */
    String getPMChat(String contactID);
    /**
    * Send a text Message
    */
    String sendMessage(String chatID, String text);
    /**
    * seen recived messages
    */
    oneway void seen(String chatID);
    /**
    * Often you want to allow a service to call back to its clients.
    * This shows how to do so, by registering a callback interface with
    * the service.
    */
    oneway void registerListener(IListener cb);
    /**
     * Remove a previously registered callback interface.
     */
    oneway void unregisterListener(IListener cb);

}