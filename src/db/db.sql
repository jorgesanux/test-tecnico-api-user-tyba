CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

drop table if exists users;
create table users(
    id uuid default uuid_generate_v4(),
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(80) not null,
    password text not null,
    primary key(id),
    unique(email)
);

drop table if exists history;
create table history(
    id uuid default uuid_generate_v4(),
    endpoint text not null,
    hostname text not null,
    ip varchar(50) not null,
    email varchar(80) not null,
    method varchar(20) not null,
    created_at timestamptz default now()::timestamptz
);

create index history_email on history(email);
create index history_endpoint on history(endpoint);
create index history_method on history(method);