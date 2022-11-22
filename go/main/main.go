package main

import (
	bridge "github.com/hood-chat/ui/go"
	// logging "github.com/ipfs/go-log/v2"
)

func main() {
	// err := logging.SetLogLevel("*", "DEBUG")
	// if err != nil {
	// 	panic("logger failed")
	// }
	conf := bridge.NewHostConfig()
	br, err := bridge.NewBridge("./", conf)
	if err != nil {
		panic("can not continue")
	}
	br.NewIdentity("farhoud")

	select {}
}
