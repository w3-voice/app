import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { createContactStoreDefaultModel } from "./ContactStore"
import { createChatListDefaultModel } from "./ChatStore"
import { createIdentityDefaultModel } from "./Identity"
import { createPermissionsDefaultModel } from "./Permissions"
import { createMessageStoreDefaultModel } from "./MessageStore"
import { createNewGroupDefaultModel } from "./NewGroup"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  contactStore: createContactStoreDefaultModel(),
  identityStore: createIdentityDefaultModel(),
  chatStore: createChatListDefaultModel(),
  permissionStore: createPermissionsDefaultModel(),
  messageStore: createMessageStoreDefaultModel(),
  newGroup: createNewGroupDefaultModel()
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
