import { Metadata } from "next";
import { OmanEnquiryForm } from "@/modules/film-in-oman/ui/oman-enquiry-form";

export const metadata: Metadata = {
  title: "Filming Enquiry — Oman",
};

export default function Page() {
  return <OmanEnquiryForm />;
}
