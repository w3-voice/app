import { BeeCoreInstance, Chat, Contact, IChat, IContact, ID, Identity, IIdentity, IMessages, IPrivateChat, Message } from "./beeCore.type";
import { NativeEventEmitter, NativeModules } from 'react-native';
const { CoreModule } = NativeModules;
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

    async add(con: Contact): Promise<Chat> {
        const res = await CoreModule.newPMChat(con._id)
        const newChat: Chat = base64ToObject(res)
        return newChat
    }
    async get(con: Contact): Promise<Chat> {
        const res = await CoreModule.getPMChat(con._id)
        const newChat: Chat = base64ToObject(res)
        return newChat
    }

}

class ContactAPI implements IContact {

    get(id: string) {
        throw new Error("Method not implemented.");
    }
    async add(con: Contact) {
        const res = await CoreModule.addContact(con._id, con.name)
        return
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

class RNBeeCore implements BeeCoreInstance {
    ready = false
    nativeEmitter: NativeEventEmitter = null
    eventListeners = []
    chat: IChat;
    pchat: IPrivateChat;
    contact: IContact;
    identity: IIdentity;
    messages: IMessages;

    constructor() {
        this.nativeEmitter = new NativeEventEmitter(CoreModule)
        this.chat = new ChatAPI()
        this.pchat = new PrivateChatAPI()
        this.contact = new ContactAPI()
        this.identity = new IdentityAPI()
        this.messages = new MessageAPI()
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

    subscribe(callback: (event: any) => void) {
        this.eventListeners.push(this.nativeEmitter.addListener('CoreEvents', callback));
    }

    unsubscribe() {
        this.nativeEmitter.removeAllListeners('CoreEvents')
        this.eventListeners = []
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
