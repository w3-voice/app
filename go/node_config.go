package bridge

// Config is used in NewNode.
type HostConfig struct {
	netDriver NativeNetDriver
	emitter   Emitter
}

func NewHostConfig() *HostConfig {
	return &HostConfig{}
}

func (c *HostConfig) SetNetDriver(driver NativeNetDriver) { c.netDriver = driver }

func (c *HostConfig) SetBroadCaster(emitter Emitter) { c.emitter = emitter }
