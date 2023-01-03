import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { save } from "../utils/storage"


/**
 * Model description here for TypeScript hints.
 */
export const NewContactModel = types
  .model("NewContact")
  .props({
    name:  types.maybeNull(types.string),
    _id:  types.maybeNull(types.string),
    saving: types.maybeNull(types.boolean),
    err: types.maybeNull(types.string),
    done: types.maybeNull(types.boolean)
  })
  .views((self) => ({
    get valid(){
      let res = true
      res = res && self._id.length > 0
      res = res && self.name.length > 0
      return res
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setName(val: string){
      self.name = val
    },
    setId(val: string){
      self._id = val
    },
    clear() {
      self._id = null
      self.name = null
      self.saving = false
      self.err = ""
      self.done = false
    },
    reset(){
      self.saving = false
      self.err = ""
      self.done = false
    }

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface NewContact extends Instance<typeof NewContactModel> { }
export interface NewContactSnapshotOut extends SnapshotOut<typeof NewContactModel> { }
export interface NewContactSnapshotIn extends SnapshotIn<typeof NewContactModel> { }
export const createNewContactDefaultModel = () => types.optional(NewContactModel, {} )
