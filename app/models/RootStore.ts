import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MessageStoreModel } from "./MessageStore"
import { ChatListModel } from "./ChatList"
import { IdentityModel } from "./Identity"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  messageStore: types.optional(MessageStoreModel, {} as any),
    identity: types.optional(IdentityModel, {isLoggedIn:false}),
    chatStore: types.optional(ChatListModel, {}),
    messages: types.optional(MessageStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
