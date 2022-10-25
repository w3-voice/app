import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ContactModel } from "./Contact"

/**
 * Model description here for TypeScript hints.
 */
export const MessageModel = types
  .model("Message")
  .props({
    _id: types.identifier,
    text: types.string,
    createdAt: types.Date,
    user: types.reference(ContactModel),
    sent: types.maybeNull(types.boolean),
    received: types.maybeNull(types.boolean),
    pending: types.maybeNull(types.boolean),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Message extends Instance<typeof MessageModel> {}
export interface MessageSnapshotOut extends SnapshotOut<typeof MessageModel> {}
export interface MessageSnapshotIn extends SnapshotIn<typeof MessageModel> {}
export const createMessageDefaultModel = () => types.optional(MessageModel, {})
