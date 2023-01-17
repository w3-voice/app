package bridge

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGetChats(t *testing.T) {
	conf := NewHostConfig()
	br, err := NewBridge(t.TempDir(),conf)
	require.NoError(t, err)

	br.IdentityAPI().SignUp("farhoud")
	require.Equal(t, br.IdentityAPI().IsLogin(), true)

}
