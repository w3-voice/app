import { BeeCore, Identity } from "../core.types";
import { Chat, Contact, Message } from "./beeCore.type";


class MockBeeCore implements BeeCore {
    private identity: Identity = undefined
    private chats: Chat[] = []
    getIdentity(): Promise<Identity> {
        return new Promise((resolve,reject)=>{
            if(this.identity != undefined){
                return resolve(this.identity)
            }
            return reject("not found")
        })

    }
    hasIdentity(): Promise<boolean> {
        return new Promise((resolve,reject)=>{
            if(this.identity != undefined){
                return resolve(true)
            }
            return resolve(false)
        })
    }
    newIdentity(name: any): Promise<Identity> {
        return new Promise((resolve,reject)=>{
            this.identity = {
                id: "1",
                name: name
            }
            return resolve(this.identity)
        })
    }
    getChatList(): Promise<Chat[]> {
        return new Promise((resolve,reject)=>{
            return resolve(mockChatList)
        })
    }
    getChatMessages(): Promise<Message[]> {
        return new Promise((resolve,reject)=>{
            return resolve(mockMessages)
        })
    }
    sendChatMessage(chatId: string, msg: Message): void {
        console.log("called")
    }
    submitNewMessages(handler: (chatId: string, msg: Message)=>void): void {}

}

const mockMessages: Message[] = [
    {
        _id: "1",
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: "1",
          name: 'ASD'
        },
    },
    {
        _id: "2",
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: "1",
          name: 'ASD'
        },
    },
    {
        _id: "3",
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: "2",
          name: 'React Native'
        },
    }
]

const mockContact: Contact[] = [
    {
        _id: "1",
        name: "farhoud"
    },
    {
        _id: "2",
        name: "farjam"
    },
    {
        _id: "3",
        name: "roozi"
    }
]


const mockChatList: Chat[] = [
    {
        id:"1",
        name:"farjam",
        members: [mockContact[0],mockContact[1]],
    },
    {
        id: "2",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "3",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "4",
        name: "roozi",
        members: [mockContact[0],mockContact[2]]
    },
    {
        id: "6",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "7",
        name: "roozi",
        members: [mockContact[0],mockContact[2]]
    },    {
        id: "8",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "9",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "10",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "11",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "12",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "13",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "14",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],

    },
    {
        id: "15",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "16",
        name: "roozi",
        members: [mockContact[0],mockContact[2]]
    },
    {
        id: "17",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "18",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "19",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    },
    {
        id: "20",
        name: "roozi",
        members: [mockContact[0],mockContact[2]],
    }
]

const mockIdentity = {
    id: "1",
    name: "farhoud"
}


export const create = ()=>{
    return new MockBeeCore()
}