package entity

type Servers struct {
	ID       uint   `db:"id"`
	Host     string `db:"host"`
	Port     uint16 `db:"port"`
	Username string `db:"username"`
	Password string `db:"password"`
	GID      uint   `db:"gid"`
}
