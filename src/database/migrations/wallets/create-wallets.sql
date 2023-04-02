--up
`CREATE TABLE wallets (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	balance float4 NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	updated_at timestamp NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	deleted_at timestamp NULL,
	CONSTRAINT "PK_id_wallet" PRIMARY KEY (id)
);
ALTER TABLE public.wallets ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);`

--down
`DROP TABLE "wallets";`
