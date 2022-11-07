import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreModel } from "./ChatStore"
import { IdentityModel } from "./Identity"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  identity: types.optional(IdentityModel, {user:null ,isLoggedIn:false}),
  chatStore: types.optional(ChatStoreModel, {newContact:{name:"", _id:""}})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
