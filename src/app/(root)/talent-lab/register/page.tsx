import type { Metadata } from "next";

import { RegisterPage } from "@/modules/talent-lab/ui/views/register-page";

export const metadata: Metadata = {
  title: "Register Your Interest | IFFA Talent Lab",
  description:
    "Register an expression of interest in the IFFA Talent Lab. Open all year — we contact you when a program matching your discipline opens.",
};

export default function Page() {
  return <RegisterPage />;
}
