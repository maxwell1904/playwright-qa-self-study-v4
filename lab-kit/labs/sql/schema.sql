CREATE TABLE laundry_order (
  order_id bigint PRIMARY KEY,
  order_code varchar(40) NOT NULL UNIQUE,
  status varchar(30) NOT NULL,
  total_amount numeric(14,0) NOT NULL,
  promised_pickup_at timestamptz NOT NULL
);

CREATE TABLE laundry_order_item (
  order_item_id bigint PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES laundry_order(order_id),
  service_code varchar(30) NOT NULL,
  line_amount numeric(14,0) NOT NULL
);

CREATE TABLE payment_transaction (
  transaction_id bigint PRIMARY KEY,
  transaction_code varchar(40) NOT NULL UNIQUE,
  order_id bigint NOT NULL REFERENCES laundry_order(order_id),
  transaction_type varchar(20) NOT NULL,
  amount numeric(14,0) NOT NULL,
  recorded_at timestamptz NOT NULL
);

CREATE TABLE order_status_history (
  history_id bigint PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES laundry_order(order_id),
  from_status varchar(30),
  to_status varchar(30) NOT NULL,
  changed_at timestamptz NOT NULL
);
