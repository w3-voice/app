import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { MessageStatus } from "../services/core/real/beeCore.type"
import { Contact, ContactModel } from "./Contact"
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
    user: ContactModel,
    status: types.integer,
    image: types.maybe(types.string),
    video: types.maybe(types.string),
    audio: types.maybe(types.string),
    system: types.maybe(types.boolean),
  })
  .views((self) => ({
    get gMessage(): GiftedMessage {
      return { ...self, 
        seen: self.status == MessageStatus.Seen, 
        pending: self.status == MessageStatus.Pending, 
        received: self.status == MessageStatus.Received, 
        failed: self.status == MessageStatus.Failed,
        sent:  self.status == MessageStatus.Sent}
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    onStatusChange(m: MessageStatus) {
      self.status = m
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Message extends Instance<typeof MessageModel> { }
export interface MessageSnapshotOut extends SnapshotOut<typeof MessageModel> { }
export interface MessageSnapshotIn extends SnapshotIn<typeof MessageModel> { }
export const createMessageDefaultModel = () => types.optional(MessageModel, {})
export interface GiftedMessage {
  _id: string | number
  text: string,
  createdAt: number | Date,
  chatId: string,
  user: Contact,
  sent?: boolean,
  seen?: boolean,
  received?: boolean,
  pending?: boolean,
  failed?: boolean,
  image?: string,
  video?: string,
  audio?: string,
  system?: boolean,
}