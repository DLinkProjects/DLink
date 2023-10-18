package storage

import (
	"fmt"
	"testing"
)

func TestNewLocalStorage(t *testing.T) {
	storage := NewLocalStorage("test")
	fmt.Println(storage.Path)
}
