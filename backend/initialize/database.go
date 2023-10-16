package initialize

import (
	"fmt"
	"os"
	"strings"

	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/DLinkProjects/DLink/backend/utils/storage"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func NewDatabase() *sqlx.DB {
	dsn := storage.NewLocalStorage(fmt.Sprintf("%s.sqlite3", consts.ProjectName))
	sqlPath := strings.Replace(dsn.Path, "DLink.sqlite3", "", -1)
	_, err := os.Stat(sqlPath)
	if os.IsNotExist(err) {
		errDir := os.MkdirAll(sqlPath, 0755)
		if errDir != nil {
			panic("Failed to create database directory")
		}
	}
	db, err := sqlx.Open("sqlite3", dsn.Path)
	if err != nil {
		panic(err)
	}
	createTables(db)
	return db
}

//goland:noinspection SqlNoDataSourceInspection
func createTables(db *sqlx.DB) {
	// 创建服务器表
	const serversTables = `
		CREATE TABLE servers (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			ip TEXT NOT NULL,
			port INTEGER NOT NULL,
			username TEXT NOT NULL,
			password TEXT NOT NULL,
			node_id INTEGER NOT NULL
		);`

	const nodesTables = `
	CREATE TABLE nodes (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	parent_id INTEGER,
    	type TEXT NOT NULL CHECK(type IN ('server', 'group')),
    	name TEXT NOT NULL
	);`

	tables := []string{serversTables, nodesTables}

	for _, table := range tables {
		_, err := db.Exec(table)
		if err != nil {
			panic(err)
		}
	}

}
