import { BeeCore, Identity } from "../core.types";
import { Chat, Contact, ID, Message } from "./beeCore.type";
import { NativeEventEmitter, NativeModules } from 'react-native';
const { CoreModule } = NativeModules;
import 'fastestsmallesttextencoderdecoder';
import { Buffer } from 'buffer';

class RNBeeCore implements BeeCore {
    ready = false
    nativeEmitter = null
    eventListeners = []

    constructor() {
        this.nativeEmitter = new NativeEventEmitter(CoreModule)
    }

    async bindService(): Promise<boolean> {
        return new Promise((res, rej)=>{
            try{
                CoreModule.startBind((val)=>{
                    this.ready = val
                    res(val)
                });
            }catch(e){
                rej(e)
            }

        })
    }

    subscribe(callback){
        this.eventListeners.push(this.nativeEmitter.addListener('CoreEvents', callback));
    }

    async getIdentity(): Promise<Identity> {
        try {
            const res = await CoreModule.getIdentity()
            const id: Identity = base64ToObject(res)
            return id
        } catch (error) {
            throw error
        }
    }
    hasIdentity(): Promise<boolean> {
        return CoreModule.hasIdentity()
    }

    async newIdentity(name: any): Promise<Identity> {
        try {
            const res = await CoreModule.newIdentity(name)
            const id: Identity = base64ToObject(res)
            return id
        } catch (error) {
            throw error
        }
    }

    async newPMChat(contact: Contact): Promise<Chat> {
        const id = await this.getIdentity()
        const res = await CoreModule.newPMChat(contact._id)
        const newChat:Chat = base64ToObject(res)
        return newChat
    }
    async getPMChat(contact: Contact): Promise<Chat> {
        const res = await CoreModule.getPMChat(contact._id)
        const newChat:Chat = base64ToObject(res)
        return newChat
    }
    async getChat(chatID: ID) {
        try {
            const res = await CoreModule.getChat(chatID.toString())
            const chat:Chat = base64ToObject(res)
            return chat
        } catch (error) {
            throw error
        }

    }
    async getChatList(): Promise<Chat[]> {
        try {
            const res = await CoreModule.getChats()
            const chat:Chat[] = base64ToObject(res)
            return chat
        } catch (error) {
            throw error
        } 
    }
    async getChatMessages(chatId: string): Promise<Message[]> {
        try {
            const res = await CoreModule.getMessages(chatId)
            const msgs:Message[] = base64ToObject(res)
            return msgs
        } catch (error) {
            throw error
        } 
    }
    async sendChatMessage(chatId: string, msg: Message): Promise<Message> {
        try {
            const res = await CoreModule.sendMessage(chatId, msg.text)
            const ms:Message = base64ToObject(res)
            return ms
        } catch (error) {
            throw error
        } 
    }
    async getMessage(id: string): Promise<Message> {
        try {
            const res = await CoreModule.getMessage(id)
            const msg:Message = base64ToObject(res)
            return msg
        } catch (error) {
            throw error
        } 
    }
    submitIncomingMessages(handler: (chatId: string, msg: Message) => void): void {

    }
    async getContactList(): Promise<Contact[]> {
        try {
            const res = await CoreModule.getContacts()
            const con:Contact[] = base64ToObject(res)
            return con
        } catch (error) {
            throw error
        } 
    }
    async newContact(contact: Contact): Promise<void> {
        try {
            const res = await CoreModule.addContact(contact._id, contact.name)
            return
        } catch (error) {
            throw error
        } 
    }

}

export const base64ToObject = <T>(msg: string): T => {
    const timeFields = ["createdAt"]
    let obj = JSON.parse(Buffer.from(msg, 'base64').toString());
    for(let f of timeFields){
        if (f in obj){
            obj[f]=convertUnixTimeToLocalDate(obj[f])
        }
    }
    return obj;
};

export const objectToBase64String = (obj: object): string => {
    const json = JSON.stringify(obj);
    return Buffer.from(json).toString('base64');
};


export const create = () => {
    return new RNBeeCore()
}

function convertUnixTimeToLocalDate(unixDate) {
    let date = new Date(unixDate*1000)
    // let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    // let offset = date.getTimezoneOffset() / 60;
    // let hours = date.getHours();

    // newDate.setHours(hours - offset);

    return date;   
}