import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel } from "./Chat"
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
  })
  .views((self) => ({
    get chatList() {
      return self.chats.values()
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
      select(chat._id)
    })
    const load = flow(function* loadChatList() {
      const list = yield api.beeCore.chat.list(0, 0)
      const root = getRootStore(self)
      const members = list.flatMap(item => item.members).filter((i)=>i !== root.identityStore.user._id)
      root.contactStore.load(members)
      list.forEach(chat => {
        self.chats.put(chat)
      });
    })
    const select = flow(function* selectChat(chatId: string) {
      const selected = self.chats.get(chatId)
      if (self.selected == null || self.selected._id !== selected._id) {
        self.selected = selected
      }
    })
    const clear = () => {
      self.selected = null
    }
    const onMessageChange = flow(function* onMessageChange(id: string, action: string) {
      //Todo: to much if and else need to clean it up 
      console.log("update message called with ", id, action)
      // New Received Message
      switch (action) {
        case "received":
          let rmsg: Message = yield api.beeCore.messages.get(id)
          // Add chat to list if not exist
          if (!self.chats.has(rmsg.chatId)) {
            const root = getRootStore(self)
            let newCH = yield api.beeCore.chat.get(rmsg.chatId)
            root.contactStore.load(newCH.members)
            self.chats.put(newCH);
          } else {
            const chat = self.chats.get(rmsg.chatId)
            chat.latestText = rmsg.text
            chat.unread += 1

          }
          break;
      }
    })
    return {
      openPMChat,
      select,
      load,
      clear,
      onMessageChange
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatStoreModel> { }
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }
export const createChatListDefaultModel = () => types.optional(ChatStoreModel, {})
