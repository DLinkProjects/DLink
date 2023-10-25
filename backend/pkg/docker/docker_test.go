package docker

import (
	"context"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDocker(t *testing.T) {
	docker, err := New(
		&Config{
			Host:    "192.168.100.77",
			Context: context.Background(),
		},
	).Connect()
	assert.Nil(t, err)

	info, err := docker.Info()
	if assert.Nil(t, err) {
		assert.NotEmpty(t, info)
	}
}
