package initialize

import (
	"fmt"
	"testing"
)

func TestNewDatabase(t *testing.T) {
	db := NewDatabase()
	fmt.Println(db)
}
