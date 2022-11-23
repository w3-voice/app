package bridge

// Config is used in NewNode.
type HostConfig struct {
	netDriver        NativeNetDriver
	broadCaster      BroadCaster
}

func NewHostConfig() *HostConfig {
	return &HostConfig{
	}
}


func (c *HostConfig) SetNetDriver(driver NativeNetDriver)         { c.netDriver = driver }

func (c *HostConfig) SetBroadCaster(broadcaster BroadCaster)         { c.broadCaster = broadcaster }