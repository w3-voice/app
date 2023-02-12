import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel } from "./Chat"
import { api } from "../services/core"
import { Message, MessageModel } from "./Message"
import { getRootStore } from "./helpers/getRootStore"
import { parse } from "../services/core/real/beeCore"

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
    const add = (c)=>{
      self.chats.put(c)
    }
    const openPMChat = flow(function* openChat(contactId: string) {
      // get or create a chat
      const chat = yield api.beeCore.pchat.open(contactId)
      //loading contacts
      if (!self.chats.has(chat._id)) {
        // add chat
        self.chats.put(chat)
        
      }
      select(chat._id)
    })
    const load = flow(function* loadChatList() {
      const list = yield api.beeCore.chat.list(0, 0)
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
    const onNewMessage = flow(function* onNewMessage(jsonMsg: string, action: string) {
      //Todo: to much if and else need to clean it up 
      let rmsg: Message = parse<Message>(jsonMsg)
      console.log("update message called with ", rmsg._id, action)
      if (!self.chats.has(rmsg.chatId)) {
        const root = getRootStore(self)
        let newCH = yield api.beeCore.chat.get(rmsg.chatId)
        self.chats.put(newCH);
      } else {
        const chat = self.chats.get(rmsg.chatId)
        chat.latestText = rmsg.text
        chat.unread += 1

      }
    })
    return {
      openPMChat,
      select,
      load,
      clear,
      onNewMessage,
      add
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatStoreModel> { }
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }
export const createChatListDefaultModel = () => types.optional(ChatStoreModel, {})
