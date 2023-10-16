package global

import (
	"github.com/DLinkProjects/DLink/backend/initialize"
	"github.com/jmoiron/sqlx"
)

func Register() {
	Database = initialize.NewDatabase()
}

func Unregister() {
	defer func(Database *sqlx.DB) {
		_ = Database.Close()
	}(Database)
}
