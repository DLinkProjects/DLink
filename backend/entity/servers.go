package entity

type Servers struct {
	Id       int    `db:"id"`
	Ip       string `db:"ip"`
	Port     int    `db:"port"`
	Username string `db:"username"`
	Password string `db:"password"`
	Gid      int    `db:"gid"`
}
