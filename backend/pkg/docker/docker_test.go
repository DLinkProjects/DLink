package docker

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDocker(t *testing.T) {
	docker, err := New(
		&Config{
			Host:    "192.168.100.77",
			Context: context.Background(),
		},
	).Connect()
	assert.Nil(t, err)

	info, err := docker.ImageList()
	if assert.Nil(t, err) {
		assert.NotEmpty(t, info)
	}
}
