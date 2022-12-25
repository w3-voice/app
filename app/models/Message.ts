import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ContactModel } from "./Contact"
import { IdentityModel } from "./Identity"

/**
 * Model description here for TypeScript hints.
 */
export const MessageModel = types
  .model("Message")
  .props({
    _id: types.identifier,
    text: types.string,
    createdAt: types.Date,
    chatId: types.string,
    user: types.reference(ContactModel),
    sent: types.maybe(types.boolean),
    received: types.maybe(types.boolean),
    pending: types.maybe(types.boolean),
    failed: types.maybe(types.boolean),
    image: types.maybe(types.string),
    video: types.maybe(types.string),
    audio: types.maybe(types.string),
    system: types.maybe(types.boolean),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    onSent(){
      self.sent = true
      self.received = false
      self.pending = false
      self.failed = false
    },
    onFailed(){
      self.sent = false
      self.received = false
      self.pending = false
      self.failed = true
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Message extends Instance<typeof MessageModel> {}
export interface MessageSnapshotOut extends SnapshotOut<typeof MessageModel> {}
export interface MessageSnapshotIn extends SnapshotIn<typeof MessageModel> {}
export const createMessageDefaultModel = () => types.optional(MessageModel, {})
