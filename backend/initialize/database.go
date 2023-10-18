package initialize

import (
	"fmt"
	"github.com/DLinkProjects/DLink/backend/consts"
	"github.com/DLinkProjects/DLink/backend/pkg/storage"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func NewDatabase() *sqlx.DB {
	localStorage := storage.NewLocalStorage(fmt.Sprintf("%s.%s", consts.ProjectName, consts.DatabaseDriver))
	if err := localStorage.CreateDirectory(); err != nil {
		panic(err)
	}
	db, err := sqlx.Open(consts.DatabaseDriver, localStorage.Path)
	if err != nil {
		panic(err)
	}
	if localStorage.DatabaseExist() {
		return db
	}
	createTables(db)
	return db
}

//goland:noinspection SqlNoDataSourceInspection
func createTables(db *sqlx.DB) {
	const serversTables = `
		CREATE TABLE servers (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			host TEXT NOT NULL,
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

	const preferencesTables = `
		CREATE TABLE preferences (
    		id INTEGER PRIMARY KEY AUTOINCREMENT,
    		theme TEXT NOT NULL DEFAULT 'auto' CHECK(theme IN ('auto','light','dark')),
    		language TEXT NOT NULL DEFAULT 'auto' CHECK(theme IN ('auto','chinese','english')),
    		auto_check_update BOOLEAN DEFAULT 1
		);`

	tables := []string{serversTables, nodesTables, preferencesTables}
	for _, table := range tables {
		if _, err := db.Exec(table); err != nil {
			panic(err)
		}
	}
}
