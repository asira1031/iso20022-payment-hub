import { supabase } from "@/lib/supabase/client";

export async function createAuditLog({
  module,
  action,
  reference_id,
  performed_by = "SYSTEM",
  details = {},
}: {
  module: string;
  action: string;
  reference_id?: string | null;
  performed_by?: string;
  details?: any;
}) {
  const auditReference = `AUDIT-${Date.now()}`;

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      audit_reference: auditReference,
      module,
      action,
      reference_id,
      performed_by,
      details,
    })
    .select()
    .single();

  return { data, error };
}