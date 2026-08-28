\set ON_ERROR_STOP on

-- J03 completion 1. TODO replace the placeholder with payment history for :order_code,
-- ordered recorded_at DESC, transaction_code DESC. Predict cardinality first.
SELECT 'TODO payment history' AS exercise_1;

-- J03 completion 2. TODO list active overdue orders at the supplied instant.
-- Active means RECEIVED, PROCESSING, READY_FOR_PICKUP.
SELECT 'TODO overdue active orders' AS exercise_2;

-- J03 completion 3. TODO prove failed pickup left both status and history count unchanged.
SELECT 'TODO failed pickup no-partial-write oracle' AS exercise_3;

-- J03 independent. TODO compute BR-32 gross/refund/net for
-- [2026-08-12T17:00:00Z, 2026-08-13T17:00:00Z).
SELECT 0::numeric AS gross_collected, 0::numeric AS refunded, 0::numeric AS net_revenue;

-- J03 failure injection. Run this wrong join, draw its six intermediate rows,
-- then repair by pre-aggregating or separating the query.
SELECT o.order_code, SUM(p.amount) AS wrong_sum
FROM laundry_order o
JOIN laundry_order_item i ON i.order_id = o.order_id
JOIN payment_transaction p ON p.order_id = o.order_id
WHERE o.order_code = 'LD-001'
GROUP BY o.order_code;
