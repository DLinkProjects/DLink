package global

import (
	"github.com/DLinkProjects/DLink/backend/initialize"
)

func Register() {
	Database = initialize.NewDatabase()
}

func Unregister() {
	_ = Database.Close()
}
