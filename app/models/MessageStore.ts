import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/core"
import { Message, MessageModel } from "./Message"

/**
 * Model description here for TypeScript hints.
 */
export const MessageStoreModel = types
  .model("MessageStore")
  .props({
    selected: types.maybeNull(types.string),
    messages: types.optional(types.array(MessageModel),[])
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const load = flow(function* load(chatId: string){
      self.selected = chatId
      const messages = yield api.beeCore.getChatMessages(chatId)
      self.messages.replace(messages) 
    })

    const send = flow(function* send(chatId: string, message: Message){
      api.beeCore.sendChatMessage(chatId, message)
      self.messages.push(message)
    })

    const clear = ()=>{
      self.selected = null
      self.messages.replace([])
    }

    return {
      send,
      load,
      clear
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface MessageStore extends Instance<typeof MessageStoreModel> {}
export interface MessageStoreSnapshotOut extends SnapshotOut<typeof MessageStoreModel> {}
export interface MessageStoreSnapshotIn extends SnapshotIn<typeof MessageStoreModel> {}
export const createMessageStoreDefaultModel = () => types.optional(MessageStoreModel, {})
