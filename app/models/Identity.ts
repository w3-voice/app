import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { api } from "../services/core"
import { ContactModel } from "./Contact"

/**
 * Model description here for TypeScript hints.
 */
export const IdentityModel = types
  .model("Identity")
  .props({
    _id: types.maybeNull(types.string),
    name: types.string,
    isLoggedIn: types.boolean
  })
  .views((self) => ({
    get user(){
      if(!self._id || !self.name ){
        return null
      }
      return {_id:self._id, name:self.name}
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const newIdentity = flow(function* newIdentity(name: string) {
      let idObj = yield api.beeCore.identity.create(name)
      self._id = idObj._id
      self.name = idObj.name 
      self.isLoggedIn = true
    })
    const loadIdentity = flow(function* load() {
      try {
        let hasId = yield api.beeCore.identity.has()
        if (!hasId) {
          self._id = null
          self.name = ""
          self.isLoggedIn = false
        }
        else {
          let idObj = yield api.beeCore.identity.get()
          self._id = idObj._id
          self.name = idObj.name 
          self.isLoggedIn = true
        }
      } catch (error) {
        console.log(error)
      }

    })
    const setName = (name) => {
      self.name = name
    }
    return {
      loadIdentity,
      newIdentity,
      setName
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Identity extends Instance<typeof IdentityModel> { }
export interface IdentitySnapshotOut extends SnapshotOut<typeof IdentityModel> { }
export interface IdentitySnapshotIn extends SnapshotIn<typeof IdentityModel> { }
export const createIdentityDefaultModel = () => types.optional(IdentityModel, {isLoggedIn:false, name:""})
