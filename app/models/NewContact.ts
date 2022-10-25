import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/core"
import { Contact } from "./Contact"

/**
 * Model description here for TypeScript hints.
 */
export const NewContactModel = types
  .model("NewContact")
  .props({name: types.string, _id: types.string})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const setName = (val: string) => {
      self.name = val
    }
    const setId = (val: string) => {
      self._id = val
    }
    const clear = () => {
      self._id = ""
      self.name = ""
    }
    return {
      setName,
      setId,
      clear
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface NewContact extends Instance<typeof NewContactModel> {}
export interface NewContactSnapshotOut extends SnapshotOut<typeof NewContactModel> {}
export interface NewContactSnapshotIn extends SnapshotIn<typeof NewContactModel> {}
export const createNewContactDefaultModel = () => types.optional(NewContactModel, {name:"", _id:""})
