"use client";

import { isEmailDevRedirect, IFFA_NOTIFICATION_EMAIL } from "@/lib/email/config";

/** Visible banner when NEXT_PUBLIC_EMAIL_DEV_REDIRECT=true — confirms env is loaded */
export function EmailDevBanner() {
  if (!isEmailDevRedirect()) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] bg-amber-500 text-black text-center text-xs py-1.5 px-3 shadow-lg"
      role="status"
    >
      <strong>Email dev mode:</strong> all form emails → {IFFA_NOTIFICATION_EMAIL}
    </div>
  );
}
