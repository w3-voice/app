import {
    onSnapshot,
    applySnapshot,
    onPatch,
    applyPatch,
    onAction,
    applyAction
} from "mobx-state-tree"
import { api } from "../../services/core"
import { ChatStoreModel } from "../ChatStore"

let subscription
export default function coreSync(store) {

    onEvent((event) => {
        console.log("error happens here")
        if(event.name == "ChangeMessageStatus" && event.group == "Messaging"){
            console.log("apply call", event.payload,event.action)
            applyAction(store, {name:"onMessageChange",args:[event.payload,event.action]})
        } 
    })

    // === SYNC ACTIONS
    // subscription = onAction(store, data => {
    //     socketSend(data)
    // })

    // onSocketMessage(data => {
    //     applyAction(store, data)
    // })

    // === SYNC SNAPSNOTS
    // subscription = onSnapshot(store, (data) => {
    //     socketSend(data)
    // })

    // onSocketMessage((data) => {
    //     applySnapshot(store, data)
    // })

    let isHandlingMessage = false

    function onEvent(handler){
        api.beeCore.subscribe((event)=>{
            console.log("error happens here")
            isHandlingMessage = true
            handler(event)
            isHandlingMessage = false
        })
    }
}

/**
 * Clean up old subscription when switching communication system
 */
if (module.hot) {
    module.hot.dispose((data) => {
        subscription()
    })
}