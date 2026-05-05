import FestivalPageTemplate from "@/modules/iffa-global/ui/components/festival-page-template";
import { festivalData } from "@/modules/iffa-global/lib/festival-data";

export default function MiffaPage() {
  return <FestivalPageTemplate data={festivalData.miffa} />;
}
