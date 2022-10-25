import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel, Chat } from "./Chat"
import { api } from "../services/core"
import { Message, MessageModel } from "./Message"
import { ContactModel } from "./Contact"
import { NewContactModel } from "./NewContact"

/**
 * Model description here for TypeScript hints.
 */
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    chats: types.array(ChatModel),
    selected: types.maybeNull(types.reference(ChatModel)),
    messages: types.optional(types.array(MessageModel),[]),
    contacts: types.array(ContactModel),
    newContact: NewContactModel
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const loadContact = flow(function* loadContact(){
      const list = yield api.beeCore.getContactList()
      console.log("Im am loading from api")
      self.contacts.replace(list)
    })
    const addContactAndCreateChat = flow(function* loadContact(){
      yield addContacts()
      yield createPMChat(self.newContact._id)
    })
    const addContacts = flow(function* addContacts(){
      const list = yield api.beeCore.getContactList()
      console.log("Im am loading from api")
      self.contacts.replace(list)
      const newContact = {name: self.newContact.name, _id: self.newContact._id}
      yield api.beeCore.newContact(newContact)
      console.log(newContact)
      self.contacts.push(newContact)

      console.log("new contact pushed")
    })
    const openPMChat = flow(function* openChat(contactId: string){
      const contact = self.contacts.find(item=>item._id===contactId)
      console.log(contact)
      const chatID = api.beeCore.generatePMChatId(contact)
      console.log(chatID)
      let chat = self.chats.find(item=>item._id === chatID)
      if(chat){
        selectChat(chat._id)
      }else{
        const newChat = yield api.beeCore.getChat(chatID)
        self.chats.push(newChat)
        selectChat(newChat._id)
      }
    })
    const createPMChat = flow(function* createChat(contactId: string){
      const contact = self.contacts.find(item=>item._id===contactId)
      const newChat: Chat = yield api.beeCore.newPMChat(contact)
      console.log(newChat)
      self.chats.push(newChat)
      selectChat(newChat._id)
      console.log("new contact pushed")
    })
    const loadChatList = flow(function* loadChatList(){
      const list = yield api.beeCore.getChatList()
      console.log(list)
      self.chats.replace(list)
      console.log(self.chats[0]._id)
    })
    const selectChat = flow(function* load(chatId: string){
      console.log(chatId)
      console.log(self.chats.slice())
      const chat = self.chats.find((item)=>item._id === chatId)
      self.selected = chat
      console.log("selected chat:", self.selected)
      const messages = yield api.beeCore.getChatMessages(chatId)
      console.log(messages)
      self.messages.replace(messages)
    })
    const send = (msg: Message)=>{
      console.log("send message", msg)
      console.log("selected contact", self.selected)
      api.beeCore.sendChatMessage(self.selected._id, {
        _id: msg._id,
        createdAt: msg.createdAt,
        user: msg.user._id,
        text: msg.text
      })
      console.log(msg)
      self.messages.push({
        _id: msg._id,
        createdAt: msg.createdAt,
        user: msg.user._id,
        text: msg.text
      })
    }
    const clear = ()=>{
      self.selected = null
      self.messages.replace([])
    }
    const afterCreate = flow(function* afterCreate(){
      yield loadChatList()
      yield loadContact()
    })
    return {
      openPMChat,
      selectChat,
      loadChatList,
      createPMChat,
      send,
      clear,
      addContacts,
      loadContact,
      afterCreate,
      addContactAndCreateChat
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatStoreModel> {}
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatStoreModel> {}
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatStoreModel> {}
export const createChatListDefaultModel = () => types.optional(ChatStoreModel, {})
