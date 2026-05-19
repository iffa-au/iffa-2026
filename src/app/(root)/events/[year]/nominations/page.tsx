import { NominationsPage } from "@/modules/events/nominations/ui/nominations-page";

type NominationsRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: NominationsRouteProps) {
  const { year } = await params;
  return <NominationsPage year={year} />;
}
