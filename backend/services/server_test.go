package services

import (
	"github.com/DLinkProjects/DLink/backend/global"
	"testing"
)

func TestServer_GetGroups(t *testing.T) {
	global.Register()
	s := NewServer()
	result, err := s.GetGroups()
	if err != nil {
		t.Error(err)
	}
	t.Log(result)
}

func TestServer_GetServers(t *testing.T) {
	global.Register()
	s := NewServer()
	result, err := s.GetServers()
	if err != nil {
		t.Error(err)
	}
	t.Log(result)
}
