package services

type Cert struct{}

func NewCret() *Cert {
	return &Cert{}
}

func (c *Cert) ImportCret() error { return nil }

func (c *Cert) ExportCret() error { return nil }

func (c *Cert) GeteCret() error { return nil }

func (c *Cert) DelteCret() error { return nil }
