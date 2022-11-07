package bridge

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGetChats(t *testing.T) {
	br, err := NewBridge(t.TempDir())
	require.NoError(t, err)

	br.core.SignUp("farhoud")
	require.Equal(t, br.core.IsLogin(), true)
}
