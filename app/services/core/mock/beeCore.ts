import { BeeCore, Identity } from "../core.types";
import { Chat, Contact, ID, Message } from "./beeCore.type";


class MockBeeCore implements BeeCore {
    private identity: Identity = mockIdentity
    private chats: Chat[] = mockChatList
    private messagesMap: Record<string, Message[]> = mockMessages()
    private contacts: Contact[] = mockContact

    getIdentity(): Promise<Identity> {
        return new Promise((resolve, reject) => {
            if (this.identity != undefined) {
                return resolve(this.identity)
            }
            return reject("not found")
        })

    }
    hasIdentity(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.identity != undefined) {
                return resolve(true)
            }
            return resolve(false)
        })
    }
    newIdentity(name: any): Promise<Identity> {
        return new Promise((resolve, reject) => {
            return resolve(this.identity)
        })
    }
    newPMChat(contact:Contact): Promise<Chat> {
        const newChat = {
            _id: generatePMId([contact, this.identity]),
            name: contact.name,
            members: [contact._id, this.identity._id],
        }
        this.chats.push(newChat)
        this.messagesMap[newChat._id]=[]
        return new Promise((resolve, reject) => {
            return resolve(newChat)
        })
    }
    getPMChat(contact:Contact) {
        const _id = generatePMId([contact, this.identity])
        const exist = this.chats.find((item)=>_id === item._id)
        if(exist){
            return new Promise((resolve, reject) => {
                return resolve(exist)
            })
        }else{
            const newChat = {
                _id: generatePMId([contact, this.identity]),
                name: contact.name,
                members: [contact._id, this.identity._id],
            }
            this.chats.push(newChat)
            this.messagesMap[newChat._id]=[]
            return new Promise((resolve, reject) => {
                return resolve(newChat)
            })
        }
  
    }
    getChatList(): Promise<Chat[]> {
        return new Promise((resolve, reject) => {
            return resolve(this.chats)
        })
    }
    getChatMessages(chatId: string): Promise<Message[]> {
        return new Promise((resolve, reject) => {
            return resolve(this.messagesMap[chatId])
        })
    }
    sendChatMessage(chatId: string, msg: Message): void {
        this.messagesMap[chatId].push(msg)
    }
    submitIncomingMessages(handler: (chatId: string, msg: Message) => void): void { 

    }
    getContactList(): Promise<Contact[]> {
        return new Promise((resolve, reject) => {
            return resolve(this.contacts)
        })
    }
    newContact(contact: Contact): Promise<void> {
        this.contacts.push(contact)
        return new Promise((resolve, reject) => {
            return resolve()
        })
    }
    generatePMChatId(contact: Contact): ID {
        return generatePMId([contact,this.identity])
    }

}

const generatePMId = (members: Contact[]) => {
    return members
        .map(m => m._id)
        .sort()
        .reduce((prev, curr) => {
            return prev + curr
        })
}

const mockMessages = (): Record<string, Message[]> => {
    const texts = ['Hello developer', 'Tnx']
    let chatMap: Record<string, Message[]> = {}
    let index = 0
    for (let item of mockChatList) {
        chatMap[item._id] = item.members.map((m) => {
            index += 1
            return {
                _id: index.toString(),
                text: `Hello from ${m}`,
                createdAt: new Date(),
                user: m,
            }
        })
        
    }
    return chatMap

}


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
        _id: generatePMId([mockContact[0], mockContact[1]]),
        name: "farjam",
        members: [mockContact[0]._id, mockContact[1]._id],
    },
    {
        _id: generatePMId([mockContact[0], mockContact[2]]),
        name: "roozi",
        members: [mockContact[0]._id, mockContact[2]._id],
    },
]

const mockIdentity: Identity = { ...mockContact[0] }


export const create = () => {
    return new MockBeeCore()
}