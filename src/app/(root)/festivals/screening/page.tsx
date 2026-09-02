import { redirect } from "next/navigation";

/**
 * The standalone screening schedule was folded into the festivals themselves:
 * every screening now belongs to a festival at `/festivals/<slug>`. This route
 * stays behind only so existing links land somewhere sensible.
 */
export default function Page() {
  redirect("/festivals");
}
