import {
    onSnapshot,
    applySnapshot,
    onPatch,
    applyPatch,
    onAction,
    applyAction
} from "mobx-state-tree"
import { api } from "../../services/core"

let subscription
export default function coreSync(store) {

    onEvent((event) => {
        if(event.name == "ChangeMessageStatus" && event.group == "Messaging"){
            applyAction(store, {name:"onMessageChange",args:[event.payload,event.action]})
        } 
    })

    let isHandlingMessage = false

    function onEvent(handler){
        api.beeCore.subscribe((event)=>{
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