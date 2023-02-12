import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ContactModel } from "./Contact"
import { createNewContactDefaultModel } from "./NewContact"
import { api } from "../services/core"
/**
 * Model description here for TypeScript hints.
 */
export const ContactStoreModel = types
  .model("ContactStore")
  .props({
    contacts: types.map(ContactModel),
    form: createNewContactDefaultModel(),
    hasMore: types.maybe(types.boolean),
  })
  .views((self) => ({
    get list() {
      return [...self.contacts.values()].sort((a, b) => a.name.localeCompare(b.name) )
    },
    has(id) {
      return self.contacts.has(id)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    load: flow(function* loadContact(ids?:string[]) {
      if(ids != undefined){
        const cons = []
        for(let id of ids){
          const exist = self.contacts.has(id)
          if(!exist){
            const con = yield api.beeCore.contact.get(id)
            cons.push(con)
            self.contacts.put(con)
          }
        }
        
      } else {
        const res = yield api.beeCore.contact.list(0, 50)
        self.hasMore = res.length == 50
        res.forEach((con)=>{self.contacts.put(con)})
      }
    }),
    add: flow(function* addContacts() {
      self.form.saving = true;
      const newContact = { _id:self.form._id, name:self.form.name }
      try {
        const res = yield api.beeCore.contact.put(newContact)
        if(res){
          self.contacts.put(newContact)
        }else{
          self.form.err = "can not add contact"
        }
        
        self.form.done = res
      } catch (error) {
        self.form.err = error
        console.log("failed to create new contract", error)
      }
      self.form.saving = false;
    }),
    addDone:()=>{self.form.clear()}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ContactStore extends Instance<typeof ContactStoreModel> {}
export interface ContactStoreSnapshotOut extends SnapshotOut<typeof ContactStoreModel> {}
export interface ContactStoreSnapshotIn extends SnapshotIn<typeof ContactStoreModel> {}
export const createContactStoreDefaultModel = () => types.optional(ContactStoreModel, {})
