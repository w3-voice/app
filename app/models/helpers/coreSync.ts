import {
    onSnapshot,
    applySnapshot,
    onPatch,
    applyPatch,
    onAction,
    applyAction
} from "mobx-state-tree"
import { EmitterSubscription } from "react-native"
import { api } from "../../services/core"


export default function coreSync(store) {
    let subscription: EmitterSubscription
    onEvent((event) => {
        if(event.name == "ChangeMessageStatus" && event.group == "Messaging"){
            applyAction(store, {name:"onMessageChange",args:[event.payload,event.action]})
        } 
    })

    let isHandlingMessage = false

    function onEvent(handler){
        subscription = api.beeCore.subscribe((event)=>{
            isHandlingMessage = true
            handler(event)
            isHandlingMessage = false
        })
    }

    return subscription
}
