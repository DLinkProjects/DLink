package storage

import (
	"github.com/vrischmann/userdir"
	"path"
)

type LocalStorage struct {
	Path string
}

func NewLocalStorage(filename string) *LocalStorage {
	return &LocalStorage{Path: path.Join(userdir.GetConfigHome(), "DLink", filename)}
}
