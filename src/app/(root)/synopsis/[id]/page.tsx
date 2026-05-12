import { SynopsisPage } from "@/modules/events/synopsis/ui/synopsis-page";

type SynopsisRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: SynopsisRouteProps) {
  const { id } = await params;
  return <SynopsisPage id={id} />;
}
