export interface BeeCoreInstance {
  bindService(): Promise<boolean>
  getIdentity(): Promise<Identity>
  hasIdentity(): Promise<boolean>
  newIdentity(name: string): Promise<Identity>
  getChat(chatId: ID): Promise<Chat>
  getChatList(): Promise<Chat[]>
  getChatMessages(id: string): Promise<Message[]>
  sendChatMessage(chatId: ID, msg: Message): Promise<Message>
  submitIncomingMessages(handler: (chatId: ID, msg: Message)=>void): void
  getContactList(): Promise<Contact[]>
  newContact(contact: Contact): Promise<void>
  newPMChat(contact:Contact): Promise<Chat>
  getPMChat(contact: Contact): Promise<Chat>
}

export type ID = string

export interface Identity {
  _id: ID
  name: string
}

export interface Contact {
  _id: ID,
  name: string
}

export interface Chat {
  _id: ID,
  name: string,
  members: ID[]
}

export interface Message {
  _id: ID,
  text: string,
  createdAt: Date | number
  user: ID,
  sent?: boolean,
  received?: boolean,
  pending?: boolean,
}

