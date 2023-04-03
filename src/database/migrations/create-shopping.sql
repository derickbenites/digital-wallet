--up
`CREATE TABLE shopping (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	wallet_id uuid NOT NULL,
	price float4 NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	updated_at timestamp NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	deleted_at timestamp NULL,
	CONSTRAINT "PK_id_shopping" PRIMARY KEY (id)
);
ALTER TABLE shopping ADD CONSTRAINT fk_user_shopping FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE shopping ADD CONSTRAINT fk_wallet_shopping FOREIGN KEY (wallet_id) REFERENCES wallets(id);`

--down
`DROP TABLE shopping;`
