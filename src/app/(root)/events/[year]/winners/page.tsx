import { WinnersPage } from "@/modules/events/winners/ui/winners-page";

type WinnersRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: WinnersRouteProps) {
  const { year } = await params;
  return <WinnersPage year={year} />;
}
