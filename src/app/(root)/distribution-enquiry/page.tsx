import type { Metadata } from "next";

import DistributionEnquiryPage from "@/modules/distribution-enquiry/ui/views/distribution-enquiry-page";

export const metadata: Metadata = {
  title: "Distribution Enquiry | IFFA Awards",
  description:
    "Looking for distribution for your film? Send IFFA the details and the rights you can offer.",
};

export default function Page() {
  return <DistributionEnquiryPage />;
}
