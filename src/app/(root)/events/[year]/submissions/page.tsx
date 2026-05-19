import { SubmissionsPage } from "@/modules/events/submissions/ui/submissions-page";

type SubmissionsRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: SubmissionsRouteProps) {
  const { year } = await params;
  return <SubmissionsPage year={year} />;
}
