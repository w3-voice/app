import {
    BeeCoreInstance,
    Chat,
    Contact,
    IChat,
    IContact,
    ID,
    Identity,
    IIdentity,
    IMessages,
    IPrivateChat,
    Message,
    IPermissions,
    PermissionStatus
} from "./beeCore.type";
import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
const { CoreModule, PermissionsModule } = NativeModules;
import 'fastestsmallesttextencoderdecoder';
import { Buffer } from 'buffer';

class ChatAPI implements IChat {

    async get(id: ID): Promise<Chat> {
        const res = await CoreModule.getChat(id.toString())
        const chat: Chat = base64ToObject(res)
        return chat
    }
    async list(skip: number, limit: number): Promise<Chat[]> {
        const res = await CoreModule.getChats(skip, limit)
        const chat: Chat[] = base64ToObject(res)
        return chat
    }
    async send(id: string, msg: Message): Promise<Message> {
        const res = await CoreModule.sendMessage(id, msg.text)
        const ms: Message = base64ToObject(res)
        return ms
    }

}

class PrivateChatAPI implements IPrivateChat {

    async add(contactID: ID): Promise<Chat> {
        const res = await CoreModule.newPMChat(contactID)
        const newChat: Chat = base64ToObject(res)
        return newChat
    }
    async get(contactID: ID): Promise<Chat> {
        const res = await CoreModule.getPMChat(contactID)
        const newChat: Chat = base64ToObject(res)
        return newChat
    }
    async open(contactID: ID): Promise<Chat> {
        const res = await CoreModule.openPMChat(contactID)
        const chat: Chat = base64ToObject(res)
        return chat
    }

}

class ContactAPI implements IContact {

    async get(id: ID): Promise<Contact> {
        const res = await CoreModule.getContact(id.toString())
        const chat: Contact = base64ToObject(res)
        return chat
    }
    async add(con: Contact): Promise<boolean> {
        const res = await CoreModule.addContact(con._id, con.name)
        return res
    }
    async list(skip: number, limit: number): Promise<Contact[]> {
        const res = await CoreModule.getContacts(skip, limit)
        const con: Contact[] = base64ToObject(res)
        return con
    }

}

class IdentityAPI implements IIdentity {
    async get(): Promise<Identity> {
        const res = await CoreModule.getIdentity()
        const id: Identity = base64ToObject(res)
        return id
    }
    has(): Promise<boolean> {
        return CoreModule.hasIdentity()
    }
    async create(name: string): Promise<Identity> {
        const res = await CoreModule.newIdentity(name)
        const id: Identity = base64ToObject(res)
        return id
    }

}

class MessageAPI implements IMessages {
    async get(id: string) {
        const res = await CoreModule.getMessage(id)
        const msg: Message = base64ToObject(res)
        return msg
    }
    async list(chatID: string, skip: number, limit: number): Promise<Message[]> {
        const res = await CoreModule.getMessages(chatID, skip, limit)
        const msgs: Message[] = base64ToObject(res)
        return msgs
    }

}

class PermissionsAPI implements IPermissions {
    openAppInfo(): void {
        PermissionsModule.openAppInfo()
    }
    status(): Promise<PermissionStatus> {
        return PermissionsModule.getState()
    }
    doneAsking(): void {
        PermissionsModule.doneAsking()
    }
    requestDisablePowerSaving(): void {
        PermissionsModule.doActionPowerSaving()
    }
    requestEnableAutoStart(): void {
        PermissionsModule.doActionAutoStart()
    }

}

class RNBeeCore implements BeeCoreInstance {
    ready = false
    nativeEmitter: NativeEventEmitter = null
    eventListeners = []
    chat: IChat;
    pchat: IPrivateChat;
    contact: IContact;
    identity: IIdentity;
    messages: IMessages;
    permissions: IPermissions;

    constructor() {
        this.nativeEmitter = new NativeEventEmitter(CoreModule)
        this.chat = new ChatAPI()
        this.pchat = new PrivateChatAPI()
        this.contact = new ContactAPI()
        this.identity = new IdentityAPI()
        this.messages = new MessageAPI()
        this.permissions = new PermissionsAPI()
    }


    async bindService(): Promise<boolean> {
        return new Promise((res, rej) => {
            try {
                CoreModule.startBind((val) => {
                    this.ready = val
                    res(val)
                });
            } catch (e) {
                rej(e)
            }

        })
    }

    subscribe(callback: (event: any) => void): EmitterSubscription{
        let subscription = this.nativeEmitter.addListener('CoreEvents', callback);
        console.log("subscribed")
        return subscription
    }

    unsubscribe() {
        this.nativeEmitter.removeAllListeners('CoreEvents')
        console.log("unsubscribed")
    }

}

export const base64ToObject = <T>(msg: string): T => {
    let obj = JSON.parse(Buffer.from(msg, 'base64').toString());
    return obj;
};

export const objectToBase64String = (obj: object): string => {
    const json = JSON.stringify(obj);
    return Buffer.from(json).toString('base64');
};


export const create = () => {
    return new RNBeeCore()
}
