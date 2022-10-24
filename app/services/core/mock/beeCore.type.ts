export interface BeeCoreInstance {
  getIdentity(): Promise<Identity>
  hasIdentity(): Promise<boolean>
  newIdentity(name: string): Promise<Identity>
  getChatList(): Promise<Chat[]>
  getChatMessages(id: string): Promise<Message[]>
  sendChatMessage(chatId: string, msg: Message): void
  submitNewMessages(handler: (chatId: string, msg: Message)=>void): void
}

export interface Identity {
  id: string
  name: string
}

export interface Contact {
  _id: string,
  name: string
}

export interface Chat {
  id: string,
  name: string,
  members: Contact[]
}

export interface Message {
  _id: string,
  text: string,
  createdAt: Date | number
  user: Contact,
  sent?: boolean,
  received?: boolean,
  pending?: boolean,
}

