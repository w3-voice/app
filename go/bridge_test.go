package bridge

import (
	"testing"

	"github.com/hood-chat/core"
	"github.com/hood-chat/core/entity"
	"github.com/stretchr/testify/require"
)

func TestUnmarshal(t *testing.T) {
	opt := core.NewGroupChat("farhoud", entity.ContactSlice{entity.Contact{"1","1"},entity.Contact{"1","1"}})
	j, err := opt.Json()
	require.NoError(t, err)
	o, err := UnMarshal[core.NewChatOpt](string(j))
	require.NoError(t, err)
	require.Equal(t, *o.Name, "farhoud")
	require.Equal(t, o.Members[0].Name, "1")
}

func TestGetChats(t *testing.T) {
	conf := NewHostConfig()
	br, err := NewBridge(t.TempDir(),conf)
	require.NoError(t, err)

	br.IdentityAPI().SignUp("farhoud")
	require.Equal(t, br.IdentityAPI().IsLogin(), true)

}
