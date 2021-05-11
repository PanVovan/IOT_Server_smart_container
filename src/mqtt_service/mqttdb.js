import pgp from "pg-promise";

port = 5432;
password = 'admin'

var db = pgp("postgres://username:password@host:port/database");