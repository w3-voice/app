import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel, Chat } from "./Chat"
import { api } from "../services/core"
import { Message, MessageModel } from "./Message"
import { getRootStore } from "./helpers/getRootStore"

/**
 * Model description here for TypeScript hints.
 */
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    chats: types.map(ChatModel),
    selected: types.maybeNull(types.reference(ChatModel)),
    messages: types.map(MessageModel),
    hasEarlierMessages: types.maybe(types.boolean)
  })
  .views((self) => ({
    get chatList() {
      return self.chats.values()
    },
    get sortedMessages() {
      return [...self.messages.values()].sort((a, b) => b.createdAt - a.createdAt)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const openPMChat = flow(function* openChat(contactId: string) {
      // get or create a chat
      const chat = yield api.beeCore.pchat.open(contactId)
      //loading contacts
      if (!self.chats.has(chat._id)) {
        const root = getRootStore(self)
        let cons = chat.members.filter((i)=>i !== root.identityStore.user._id)
        root.contactStore.load(cons)
        // add chat
        self.chats.put(chat)
        
      }
      selectChat(chat._id)

    })
    const loadChatList = flow(function* loadChatList() {
      const list = yield api.beeCore.chat.list(0, 50)
      const root = getRootStore(self)
      const members = list.flatMap(item => item.members).filter((i)=>i !== root.identityStore.user._id)
      root.contactStore.load(members)
      list.forEach(chat => {
        self.chats.put(chat)
      });
    })
    const selectChat = flow(function* selectChat(chatId: string) {
      const selected = self.chats.get(chatId)
      if (self.selected == null || self.selected._id !== selected._id) {
        self.selected = selected
        self.hasEarlierMessages = true
        self.messages.clear()
      }

    })
    const loadMessages = flow(function* loadMessages() {
      const messages: Message[] = yield api.beeCore.messages.list(self.selected._id, self.messages.size, self.messages.size + 20)
      self.hasEarlierMessages = !(messages.length < 20);
      messages.forEach(msg => {
        self.messages.put(msg)
      });
    })
    const send = flow(function* send(msg: Message) {
      let rmsg: Message = yield api.beeCore.chat.send(self.selected._id, {
        _id: msg._id,
        chatId: "",
        createdAt: msg.createdAt,
        user: msg.user._id,
        text: msg.text
      })
      self.messages.put(rmsg)
    })
    const clear = () => {
      self.selected = null
      self.messages.clear()
    }
    const onMessageChange = flow(function* onMessageChange(id: string, action: string) {
      //Todo: to much if and else need to clean it up 
      console.log("update message called with ", id, action)
      // New Received Message
      switch (action) {
        case "received":
          let rmsg: Message = yield api.beeCore.messages.get(id)
          // Chat if chat open put message
          if (self.selected && self.selected._id === rmsg.chatId) {
            self.messages.put(rmsg)
          }
          // Add chat to list if not exist
          if (!self.chats.has(rmsg.chatId)) {
            const root = getRootStore(self)
            let newCH = yield api.beeCore.chat.get(rmsg.chatId)
            root.contactStore.load(newCH.members)
            self.chats.put(newCH);
          }
          break;
        case "sent":
          let smsg = self.messages.get(id)
          if (self.selected && smsg && self.selected._id === smsg.chatId ) {
            smsg.onSent()
          }
          break;
        case "failed":
          let nmsg = self.messages.get(id)
          if (self.selected && nmsg && self.selected._id === nmsg.chatId) {
            nmsg.onFailed()
          }
          break;  
      }
    })
    return {
      loadMessages,
      openPMChat,
      selectChat,
      loadChatList,
      send,
      clear,
      onMessageChange
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatStoreModel> { }
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }
export const createChatListDefaultModel = () => types.optional(ChatStoreModel, {})
