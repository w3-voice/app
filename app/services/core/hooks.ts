import { useEffect, useState } from "react";
import {api} from "./"


export function useCore(): [boolean, Error | null] {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api.beeCore.bindService()
        .then((v)=>{
            setLoaded(true)
        }).catch((e)=>{
          console.log("can not bind", e)
            setError(e)
        })

    }, []);
  
    return [loaded, error];
  }