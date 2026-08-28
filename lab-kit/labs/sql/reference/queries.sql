\set ON_ERROR_STOP on

-- Completion 1: stable newest-first history for one business order code.
SELECT p.transaction_code, p.transaction_type, p.amount, p.recorded_at
FROM payment_transaction p
JOIN laundry_order o ON o.order_id = p.order_id
WHERE o.order_code = :'order_code'
ORDER BY p.recorded_at DESC, p.transaction_code DESC;

-- Completion 2: active and overdue at a supplied instant.
SELECT order_code, status, promised_pickup_at
FROM laundry_order
WHERE status IN ('RECEIVED', 'PROCESSING', 'READY_FOR_PICKUP')
  AND promised_pickup_at < '2026-08-13T12:00:00Z'::timestamptz
ORDER BY promised_pickup_at, order_code;

-- Completion 3: known failed pickup snapshot; no COMPLETED row was added.
SELECT o.order_code, o.status,
       COUNT(h.history_id) AS history_rows,
       COUNT(h.history_id) FILTER (WHERE h.to_status = 'COMPLETED') AS completed_rows
FROM laundry_order o
LEFT JOIN order_status_history h ON h.order_id = o.order_id
WHERE o.order_code = 'LD-002'
GROUP BY o.order_code, o.status;

-- Independent BR-32: lower bound included, upper bound excluded.
SELECT
  COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'COLLECTION'), 0) AS gross_collected,
  COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'REFUND'), 0) AS refunded,
  COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'COLLECTION'), 0)
    - COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'REFUND'), 0) AS net_revenue
FROM payment_transaction
WHERE recorded_at >= '2026-08-12T17:00:00Z'::timestamptz
  AND recorded_at < '2026-08-13T17:00:00Z'::timestamptz;

-- Failure repair: aggregate payments before joining to item cardinality.
WITH payment_totals AS (
  SELECT order_id, SUM(amount) AS payment_sum
  FROM payment_transaction
  GROUP BY order_id
)
SELECT o.order_code, pt.payment_sum, COUNT(i.order_item_id) AS item_count
FROM laundry_order o
JOIN payment_totals pt ON pt.order_id = o.order_id
JOIN laundry_order_item i ON i.order_id = o.order_id
WHERE o.order_code = 'LD-001'
GROUP BY o.order_code, pt.payment_sum;
