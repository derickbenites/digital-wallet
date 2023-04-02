--up
`CREATE TABLE "users" (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    "password" varchar NOT NULL,
    status bool NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
    updated_at timestamp NULL DEFAULT 'now'::text::timestamp(6) with time zone,
    deleted_at timestamp NULL,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
    CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
);`

--down
`DROP TABLE "users";`
