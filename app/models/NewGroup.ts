import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatModel } from "./Chat"
import { ContactModel } from "./Contact"
import { api } from "../services/core"
import { ChatType } from "../services/core/real"
import { getRootStore } from "./helpers/getRootStore"

/**
 * Model description here for TypeScript hints.
 */
export const NewGroupModel = types
  .model("NewGroup")
  .props({
    name: types.string,
    selected: types.map(ContactModel),
    done: types.boolean,
    error: types.maybeNull(types.string)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    createChat: flow(function* createChat() {
      try{
        let chat = yield api.beeCore.chat.create({name:self.name,members:[...self.selected.values()],type:ChatType.Group})
        let root = getRootStore(self)
        root.chatStore.add(chat)
        root.messageStore.open(chat._id)
        self.name = ""
        self.done = true
        self.selected.clear()
      } catch(e) {
        self.error = e.message
        console.error(e)
        self.done = false
      }
      
    }),
    onSelectChange: (contact)=>{
      if(self.selected.has(contact._id)){
        self.selected.delete(contact._id)
      } else {
        self.selected.put({...contact})
      }
      console.log(self.selected)
    },
    setName(name){
      self.name = name
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface NewGroup extends Instance<typeof NewGroupModel> {}
export interface NewGroupSnapshotOut extends SnapshotOut<typeof NewGroupModel> {}
export interface NewGroupSnapshotIn extends SnapshotIn<typeof NewGroupModel> {}
export const createNewGroupDefaultModel = () => types.optional(NewGroupModel, {name:"",selected:{},done:false})
