package entity

type Container struct {
	Name    string `json:"name"`
	ID      string `json:"id"`
	Image   string `json:"image"`
	State   string `json:"state"`
	Status  string `json:"status"`
	Created int64  `json:"created"`
	// Ports   []*ContainerPort  `json:"ports"`
	// Mounts  []*ContainerMount `json:"mounts"`
}

type ContainerPort struct {
	IP          string `json:"ip"`
	Type        string `json:"type"`
	PrivatePort uint16 `json:"private_port"`
	PublicPort  uint16 `json:"public_port"`
}

type ContainerMount struct {
	Type        string `json:"type"`
	Name        string `json:"name"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	Driver      string `json:"driver"`
	Mode        string `json:"mode"`
	RW          bool   `json:"rw"`
}

type Image struct {
	Name    string `json:"name"`
	Tag     string `json:"tag"`
	ID      string `json:"id"`
	Created int64  `json:"created"`
	Size    int64  `json:"size"`
}
