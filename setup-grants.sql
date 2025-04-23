-- ✅ Apply enum type to the paymentMode column if needed
ALTER TABLE "Expense"
ALTER COLUMN "paymentMode"
TYPE "PaymentMode"
USING "paymentMode"::"PaymentMode";

-- ✅ Grant basic usage & access for Supabase service_role
GRANT USAGE ON SCHEMA public TO service_role;

-- ✅ Allow reading from all tables and sequences
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ✅ Allow deletion of rows
GRANT DELETE ON ALL TABLES IN SCHEMA public TO service_role;
