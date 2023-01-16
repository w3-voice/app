import { EmitterSubscription } from "react-native"

export interface BeeCoreInstance {
  chat: IChat
  pchat: IPrivateChat
  contact: IContact
  identity: IIdentity
  messages: IMessages
  permissions: IPermissions
  bindService(): Promise<boolean>
  subscribe(callback: (event: any) => void): EmitterSubscription
  unsubscribe(): void
}

export interface IChat {
  get(id: ID): Promise<Chat>
  list(skip: number, limit: number):  Promise<Chat[]>
  send(id: ID, msg: Message): Promise<Message>
}

export interface IPrivateChat {
  add(con: ID): Promise<Chat>
  get(conId: ID): Promise<Chat>
  open(contactID: ID): Promise<Chat>
}

export interface IMessages {
  get(id: ID)
  list(chatID: ID, skip: number, limit: number): Promise<Message[]>
}

export interface IContact {
  get(id: ID): Promise<Contact>
  add(con: Contact): Promise<boolean>
  list(skip: number, limit: number): Promise<Contact[]>
}

export interface IIdentity {
  get(): Promise<Identity>
  has(): Promise<boolean>
  create(name: string): Promise<Identity>
}

export interface IPermissions {
  openAppBatteryOptimization(): void
  status(): Promise<PermissionStatus>
  doneAsking(): void
  requestDisablePowerSaving(): void
  requestEnableAutoStart(): void
  openAppInfo():void
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
  chatId: string,
  createdAt: Date | number
  user: ID,
  sent?: boolean,
  received?: boolean,
  pending?: boolean,
  failed?: boolean,
}

export interface Event {
  name: string,
  action: string,
  group: string,
  payload: string
}

export interface PermissionStatus {
  supported: boolean
  autostart: boolean
  powersave: boolean
  isAsked:   boolean
}