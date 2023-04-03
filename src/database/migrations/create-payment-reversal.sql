--up
`CREATE TABLE payment_reversal (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	wallet_id uuid NOT NULL,
	transaction_id uuid NOT NULL,
	created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	updated_at timestamp NULL DEFAULT 'now'::text::timestamp(6) with time zone,
	deleted_at timestamp NULL,
	CONSTRAINT "PK_id_payment_reversal" PRIMARY KEY (id)
);
ALTER TABLE payment_reversal ADD CONSTRAINT fk_user_payment_reversal FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE payment_reversal ADD CONSTRAINT fk_wallet_payment_reversal FOREIGN KEY (wallet_id) REFERENCES wallets(id);
ALTER TABLE payment_reversal ADD CONSTRAINT fk_transaction_payment_reversal FOREIGN KEY (transaction_id) REFERENCES transactions(id);`

--down
`DROP TABLE payment_reversal;`
