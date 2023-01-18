import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/core"
import { Message, MessageModel } from "./Message"
import { getRootStore } from "./helpers/getRootStore"
import { getUnixTime } from "date-fns"

const PAGINATION_SIZE = 20
const REFRESH_SIZE = 5

/**
 * Model description here for TypeScript hints.
 */
export const MessageStoreModel = types
  .model("MessageStore")
  .props({
    messages: types.map(MessageModel),
    hasEarlierMessages: types.maybe(types.boolean),
    chatId: types.maybeNull(types.string),
    block: types.maybeNull(types.number)
  })
  .views((self) => ({
    get sortedMessages() {
      return [...self.messages.values()].sort((a, b) => b.createdAt - a.createdAt)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const onFocus = flow(function* onFocus() {
      if(self.block+1000< getUnixTime(new Date())){
        refresh()
        self.block=getUnixTime(new Date())
      } 
      // check chat is selected
      api.beeCore.chat.seen(self.chatId)
    })
    const open = flow(function* open(chatId) {
      if(self.chatId !== chatId){
        self.chatId = chatId
        self.block = getUnixTime(new Date())
        clear()
        load()
      } 
    })
    const refresh = flow(function* refresh() {
      let skip = 0
      let limit = self.messages.size > 0 ? PAGINATION_SIZE : REFRESH_SIZE
      const messages: Message[] = yield api.beeCore.messages.list(self.chatId, skip, limit)
      self.hasEarlierMessages = !(messages.length < 20);
      messages.forEach(msg => {
        self.messages.put(msg)
      });
    })
    const load = flow(function* load() {
      const messages: Message[] = yield api.beeCore.messages.list(self.chatId, self.messages.size, self.messages.size + PAGINATION_SIZE)
      self.hasEarlierMessages = !(messages.length < 20);
      messages.forEach(msg => {
        self.messages.put(msg)
      });
    })
    const send = flow(function* send(msg: Message) {
      let rmsg: Message = yield api.beeCore.chat.send(self.chatId, {
        _id: msg._id,
        chatId: "",
        createdAt: msg.createdAt,
        user: msg.user._id,
        text: msg.text
      })
      self.messages.put(rmsg)
    })
    const clear = () => {
      self.messages.clear()
      self.hasEarlierMessages = false
    }
    const onMessageChange = flow(function* onMessageChange(id: string, action: string) {
      //Todo: to much if and else need to clean it up 
      console.log("update message called with ", id, action)
      // New Received Message
      switch (action) {
        case "received":
          let rmsg: Message = yield api.beeCore.messages.get(id)
          // Chat if chat open put message
          if (self.chatId && self.chatId === rmsg.chatId) {
            self.messages.put(rmsg)
          }
          break;
        case "sent":
          let smsg = self.messages.get(id)
          if (self.chatId && smsg && self.chatId === smsg.chatId) {
            smsg.onSent()
          }
          break;
        case "failed":
          let nmsg = self.messages.get(id)
          if (self.chatId && nmsg && self.chatId === nmsg.chatId) {
            nmsg.onFailed()
          }
          break;
      }
    })
    return {
      onFocus,
      refresh,
      load,
      send,
      clear,
      open,
      onMessageChange
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface MessageStore extends Instance<typeof MessageStoreModel> { }
export interface MessageStoreSnapshotOut extends SnapshotOut<typeof MessageStoreModel> { }
export interface MessageStoreSnapshotIn extends SnapshotIn<typeof MessageStoreModel> { }
export const createMessageStoreDefaultModel = () => types.optional(MessageStoreModel, {})
