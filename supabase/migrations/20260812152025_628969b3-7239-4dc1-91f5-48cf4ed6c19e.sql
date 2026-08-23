UPDATE transactions
SET paid = false,
    paid_at = null
WHERE amount > 0 AND paid = true;