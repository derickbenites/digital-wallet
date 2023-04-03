--up
`CREATE TABLE transactions (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	wallet_id uuid NOT NULL,
	value_transaction float4 NOT NULL,
	action integer NOT NULL,
	created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	created_by varchar(36) NOT NULL,
	deleted_at timestamp NULL,
	deteled_by varchar(36) NULL,
	CONSTRAINT "PK_id_transaction" PRIMARY KEY (id)
);
ALTER TABLE transactions ADD CONSTRAINT fk_user_transaction FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE transactions ADD CONSTRAINT fk_wallet_transaction FOREIGN KEY (wallet_id) REFERENCES wallets(id);`

--down
`DROP TABLE transactions;`
