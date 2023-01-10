package bridge

import (
	"context"
	"net"

	"github.com/hood-chat/ui/go/utils"

	"github.com/hood-chat/core"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/config"
	"github.com/libp2p/go-libp2p/core/host"

	rcmgr "github.com/libp2p/go-libp2p/p2p/host/resource-manager"
	"github.com/multiformats/go-multiaddr"
	madns "github.com/multiformats/go-multiaddr-dns"
	manet "github.com/multiformats/go-multiaddr/net"

	ds "github.com/ipfs/go-datastore"
	dsync "github.com/ipfs/go-datastore/sync"

	logging "github.com/ipfs/go-log/v2"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p/p2p/host/autorelay"
	rh "github.com/libp2p/go-libp2p/p2p/host/routed"

	"github.com/ipfs/kubo/core/bootstrap"
)

var dialer net.Dialer
var DefaultResolver = net.Resolver{
	PreferGo: false,
	Dial: func(context context.Context, _, _ string) (net.Conn, error) {
		conn, err := dialer.DialContext(context, "udp", "4.2.2.6:53")
		if err != nil {
			return nil, err
		}
		return conn, nil
	},
}

type MobileNode struct {
	config *HostConfig
}

func NewMobileNode(conf *HostConfig) core.Builder {
	if conf == nil {
		conf = NewHostConfig()
	}

	// Set up netdriver.
	if conf.netDriver != nil {
		net.DefaultResolver = &DefaultResolver
		rslvOpt := madns.WithDefaultResolver(&DefaultResolver)
		maRslv, err := madns.NewResolver(rslvOpt)
		if err != nil {
			panic(err)
		}
		madns.DefaultResolver = maRslv
		inet := &inet{
			net: conf.netDriver,
		}
		utils.SetNetDriver(inet)
		manet.SetNetInterface(inet)
		err = logging.SetLogLevelRegex(".*", "DEBUG")
		if err != nil {
			panic("logger failed")
		}
	}

	mb := MobileNode{
		config: conf,
	}

	return mb

}

func (m MobileNode) Create(opt core.Option) (host.Host, error) {
	log.Debug("create called")
	basicHost, err := libp2p.New(opt.LpOpt...)
	if err != nil {
		return nil, err
	}

	// Construct a datastore (needed by the DHT). This is just a simple, in-memory thread-safe datastore.
	dstore := dsync.MutexWrap(ds.NewMapDatastore())

	// Make the DHT
	kDht := dht.NewDHT(context.Background(), basicHost, dstore)

	bt, err := core.ParseBootstrapPeers(core.BootstrapNodes)
	if err != nil {
		return nil, err
	}
	btconf := bootstrap.BootstrapConfigWithPeers(bt)
	btconf.MinPeerThreshold = 1

	// connect to the chosen ipfs nodes

	_, err = bootstrap.Bootstrap(opt.ID, basicHost, kDht, btconf)
	if err != nil {
		log.Debugf("bootstrap failed. %s", err.Error())
	}

	// Make the routed host
	routedHost := rh.Wrap(basicHost, kDht)
	for _, val := range bt {
		err = routedHost.Connect(context.Background(), val)
		if err != nil {
			log.Errorf("failed to connect to %s bootstraps reason: %s ", val.String(), err.Error())
		}
	}

	log.Debugf("core bootstrapped and ready on: %s", routedHost.Addrs())
	return routedHost, nil

}

var ListenAddrs = func(cfg *config.Config) error {
	ip4ListenAddr, err := multiaddr.NewMultiaddr("/ip4/0.0.0.0/tcp/0")
	if err != nil {
		return err
	}
	quicListenAddr, err := multiaddr.NewMultiaddr("/ip4/0.0.0.0/udp/0/quic-v1")
	if err != nil {
		return err
	}

	ip6ListenAddr, err := multiaddr.NewMultiaddr("/ip6/::/tcp/0")
	if err != nil {
		return err
	}
	return cfg.Apply(libp2p.ListenAddrs(
		quicListenAddr,
		ip4ListenAddr,
		ip6ListenAddr,
	))

}

func Option() core.Option {

	bts, err := core.ParseBootstrapPeers(core.BootstrapNodes)
	if err != nil {
		panic(err)
	}

	rslvOpt := madns.WithDefaultResolver(&DefaultResolver)
	maRslv, err := madns.NewResolver(rslvOpt)
	if err != nil {
		panic(err)
	}

	opt := []libp2p.Option{
		ListenAddrs,
		libp2p.EnableAutoRelay(autorelay.WithStaticRelays(bts), autorelay.WithNumRelays(1)),
		libp2p.EnableNATService(),
		libp2p.EnableHolePunching(),
		libp2p.MultiaddrResolver(maRslv),
		// libp2p.ForceReachabilityPrivate(),
	}
	return core.Option{
		LpOpt: opt,
		ID:    "",
	}
}

var ResourceManager = func(cfg *libp2p.Config) error {
	// Default memory limit: 1/8th of total memory, minimum 128MB, maximum 1GB
	limits := rcmgr.DefaultLimits
	libp2p.SetDefaultServiceLimits(&limits)
	limiter := rcmgr.NewFixedLimiter(limits.AutoScale())
	mgr, err := rcmgr.NewResourceManager(limiter)
	if err != nil {
		return err
	}

	return cfg.Apply(libp2p.ResourceManager(mgr))
}
