import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel } from "./Chat"
import { api } from "../services/core"

/**
 * Model description here for TypeScript hints.
 */
export const ChatListModel = types
  .model("ChatList")
  .props({
    list: types.array(ChatModel)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const loadChatList = flow(function* loadChatList(){
      const list = yield api.beeCore.getChatList()
      self.list.replace(list)
    })
    return {
      loadChatList,
      afterCreate: loadChatList
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ChatList extends Instance<typeof ChatListModel> {}
export interface ChatListSnapshotOut extends SnapshotOut<typeof ChatListModel> {}
export interface ChatListSnapshotIn extends SnapshotIn<typeof ChatListModel> {}
export const createChatListDefaultModel = () => types.optional(ChatListModel, {})
