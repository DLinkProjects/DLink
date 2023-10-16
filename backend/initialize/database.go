package initialize

import (
	"fmt"
	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/DLinkProjects/DLink/backend/utils/storage"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func NewDatabase() *sqlx.DB {
	dsn := storage.NewLocalStorage(fmt.Sprintf("%s.sqlite3", consts.ProjectName))
	db, err := sqlx.Open("sqlite3", dsn.Path)
	if err != nil {
		panic(err)
	}
	return db
}
