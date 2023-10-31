package storage

import (
	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/vrischmann/userdir"
	"os"
	"path"
	"path/filepath"
)

type LocalStorage struct {
	Path string
	dir  string
}

func NewLocalStorage(filename string) *LocalStorage {
	return &LocalStorage{Path: path.Join(userdir.GetConfigHome(), consts.ProjectName, filename)}
}

func (l *LocalStorage) CreateDirectory() error {
	l.dir = filepath.Dir(l.Path)
	if !l.directoryExist() {
		if err := os.MkdirAll(l.dir, 0755); err != nil {
			return err
		}
	}
	return nil
}

func (l *LocalStorage) DatabaseExist() bool {
	_, err := os.Stat(l.Path)
	return !os.IsNotExist(err)
}

func (l *LocalStorage) directoryExist() bool {
	_, err := os.Stat(l.dir)
	return !os.IsNotExist(err)
}
