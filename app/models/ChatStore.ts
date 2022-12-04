import {  flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
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
    messages:types.array(MessageModel),
    contacts: types.array(ContactModel),
    newContact: NewContactModel
  })
  .views((self) => ({
     get sortedMessages(){
      return self.messages.slice().sort((a,b)=> b.createdAt - a.createdAt)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const loadContact = flow(function* loadContact(){
      const list = yield api.beeCore.getContactList()
      self.contacts.replace(list)
    })
    const addContactAndCreateChat = flow(function* loadContact(){
      yield addContacts()
      yield createPMChat(self.newContact._id)
    })
    const addContacts = flow(function* addContacts(){
      const newContact = {...self.newContact}
      try {
        yield api.beeCore.newContact(newContact)
        self.contacts.push(newContact)
      } catch (error) {
        console.log("failed to create new contract", error)
      }
    })
    const openPMChat = flow(function* openChat(contactId: string){
      let done = false;
      const contact = self.contacts.find(item=>item._id===contactId)
      try {
        const chat: Chat = yield api.beeCore.getPMChat(contact)
        let exist = self.chats.find(item=>item._id === chat._id)
        if (!exist){
          self.chats.push(chat)
        }
        selectChat(chat._id)
        done = true;        
      } catch (error) {
        console.log("can not open chat",error)
      }

      if(!done){
        try {
          const chat: Chat = yield api.beeCore.newPMChat(contact)
          self.chats.push(chat)
          selectChat(chat._id)
          done = true;        
        } catch (error) {
          console.log("can not create chat",error)
        }
      }
      if(!done){
        throw "can not open chat"
      }
    })
    const createPMChat = flow(function* createChat(contactId: string){
      const contact = self.contacts.find(item=>item._id===contactId)
      const newChat: Chat = yield api.beeCore.newPMChat(contact)
      self.chats.push(newChat)
      selectChat(newChat._id)
    })
    const loadChatList = flow(function* loadChatList(){
      const list = yield api.beeCore.getChatList()
      self.chats.replace(list)
    })
    const selectChat = flow(function* selectChat(chatId: string){
      const chat = self.chats.find((item)=>item._id === chatId)
      self.selected = chat
      const messages = yield api.beeCore.getChatMessages(chatId)
      // console.log(messages)
      self.messages.replace(messages)
    })
    const send = flow(function* send(msg: Message){
      let rmsg: Message = yield api.beeCore.sendChatMessage(self.selected._id, {
        _id: msg._id,
        chatId : "",
        createdAt: msg.createdAt,
        user: msg.user._id,
        text: msg.text
      })
      // setMsgs([rmsg, ...self.messages])
      self.messages.push(rmsg)
    })
    const clear = ()=>{
      self.selected = null
      self.messages.replace([])
    }
    const onMessageChange = flow(function* onMessageChange(id: string, action: string){
      console.log("update message called with ", id, action)
      if (self.selected !== null && self.messages.length>0){
        console.log("pass data check")
        try {
          let rmsg: Message = yield api.beeCore.getMessage(id)
          console.log(rmsg._id,rmsg.chatId)
          if (action === "received"){
            //TODO: Fix It
            if(self.selected._id === rmsg.chatId){
              self.messages.push(rmsg)
              // setMsgs([rmsg, ...self.messages])
            }
            // TODO update chat list if chat not exist.   
          }
          if (self.selected._id === rmsg.chatId && self.selected._id === rmsg.chatId && action === "sent"){
            let msgg = null
            let index = self.messages.findIndex((item)=>(item._id === rmsg._id))
            
            if(index > -1){
              console.log("update message status :", index)
              self.messages[index].onSent()
              console.log("message status ", self.messages[index])
            }
          }
         
        } catch (error) {
          console.log(error)
        }

      }
    })
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
      addContactAndCreateChat,
      onMessageChange
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatStoreModel> {}
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatStoreModel> {}
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatStoreModel> {}
export const createChatListDefaultModel = () => types.optional(ChatStoreModel, {})
