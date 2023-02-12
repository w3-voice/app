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
    PermissionStatus,
    Filter,
    Callback,
    Event,
    NewChatOpt
} from "./beeCore.type";
import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
const { CoreModule, PermissionsModule } = NativeModules;
import 'fastestsmallesttextencoderdecoder';
import { Buffer } from 'buffer';

class ChatAPI implements IChat {
    async create(opt: NewChatOpt): Promise<Chat> {
        const res = await CoreModule.newGPChat(toJson(opt))
        const chat: Chat = parse<Chat>(res)
        return chat
    }
    
    seen(id: string): void {
        CoreModule.seen(id)
    }

    async get(id: ID): Promise<Chat> {
        const res = await CoreModule.getChat(id.toString())
        const chat: Chat = parse<Chat>(res)
        return chat
    }
    async list(skip: number, limit: number): Promise<Chat[]> {
        const res = await CoreModule.getChats(skip, limit)
        const chat: Chat[] = parse<Chat[]>(res)
        return chat
    }
    async send(id: string, msg: Message): Promise<Message> {
        const res = await CoreModule.sendMessage(id, msg.text)
        const ms: Message = parse<Message>(res)
        return ms
    }

}

class PrivateChatAPI implements IPrivateChat {

    async add(contactID: ID): Promise<Chat> {
        const res = await CoreModule.newPMChat(contactID)
        const newChat: Chat = parse<Chat>(res)
        return newChat
    }
    async get(contactID: ID): Promise<Chat> {
        const res = await CoreModule.getPMChat(contactID)
        const newChat: Chat = parse<Chat>(res)
        return newChat
    }
    async open(contactID: ID): Promise<Chat> {
        const res = await CoreModule.openPMChat(contactID)
        const chat: Chat = parse<Chat>(res)
        return chat
    }

}

class ContactAPI implements IContact {

    async get(id: ID): Promise<Contact> {
        const res = await CoreModule.getContact(id.toString())
        const chat: Contact = parse<Contact>(res)
        return chat
    }
    async put(con: Contact): Promise<boolean> {
        const res = await CoreModule.putContact(con._id, con.name)
        return res
    }
    async list(skip: number, limit: number): Promise<Contact[]> {
        const res = await CoreModule.getContacts(skip, limit)
        const con: Contact[] = parse<Contact[]>(res)
        return con
    }

}

class IdentityAPI implements IIdentity {
    async get(): Promise<Identity> {
        const res = await CoreModule.getIdentity()
        const id: Identity = parse<Identity>(res)
        return id
    }
    has(): Promise<boolean> {
        return CoreModule.hasIdentity()
    }
    async create(name: string): Promise<Identity> {
        const res = await CoreModule.newIdentity(name)
        const id: Identity = parse<Identity>(res)
        return id
    }

}

class MessageAPI implements IMessages {
    async get(id: string) {
        const res = await CoreModule.getMessage(id)
        const msg: Message = parse<Message>(res)
        return msg
    }
    async list(chatID: string, skip: number, limit: number): Promise<Message[]> {
        const res = await CoreModule.getMessages(chatID, skip, limit)
        const msgs: Message[] = parse<Message[]>(res)
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
    openAppBatteryOptimization(): void {
        PermissionsModule.openAppBatteryOptimization()
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
                console.log("bind called")
                CoreModule.startBind((val) => {
                    this.ready = val
                    console.log("bind called")
                    res(val)
                });
            } catch (e) {
                console.error(e)
                rej(e)
            }

        })
    }

    subscribe(callback: Callback,filter: Filter): EmitterSubscription{
        const subCB = BuildEventCallBack(callback, filter)
        let subscription = this.nativeEmitter.addListener('CoreEvents', subCB);
        console.log("subscribed")
        return subscription
    }

    unsubscribe() {
        this.nativeEmitter.removeAllListeners('CoreEvents')
        console.log("unsubscribed")
    }

}

function BuildEventCallBack(cb: Callback,filter: Filter ){
    return (evt: Event)=>{
        if (filter(evt)) {
            cb(evt)
        }
    }
}

export const parse = <T>(msg: string): T => {
    let obj = JSON.parse(msg);
    return obj;
};

export const toJson = (obj: object): string => {
    const json = JSON.stringify(obj);
    return json
};


export const create = () => {
    return new RNBeeCore()
}
