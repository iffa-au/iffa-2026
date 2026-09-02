import { partnerGroups } from "../../data/partners-data";
import { pageCopy, talentLabEdition } from "../../data/talent-lab-edition";
import { CalloutBand } from "../components/callout-band";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { PartnerTile } from "../components/partner-tile";

const copy = pageCopy.partners;

export function PartnersPage() {
  return (
    <div className="bg-black text-white">
      {/*
        The intro is not decoration. "No organisation is listed as a partner
        until an agreement is in place" is a commitment carried over from the
        source program plan, and this page is where it is either kept or broken.
        Every tile below therefore also carries its own "not confirmed" label —
        the promise is repeated per item rather than made once and forgotten.
      */}
      <PageHeader
        crumbs={[{ label: "Talent Lab", href: "/talent-lab" }, { label: "Partners" }]}
        title={copy.title}
        intro={copy.intro}
      />

      <PageSection bordered={false}>
        <div className="flex flex-col gap-14">
          {partnerGroups.map((group) => (
            <div key={group.category} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <h2 className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.24em] text-yellow-400">
                  {group.category}
                </h2>
                <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.organisations.map((organisation) => (
                  <PartnerTile
                    key={organisation}
                    organisation={organisation}
                    note={copy.placeholderNote}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          {/*
            §11.3 — the partner enquiry action has no decided destination
            (`/contact`, a dedicated form, or a mailto). Rather than invent one,
            the button renders inert with a stated reason, and the live contact
            address beside it gives anyone reading a real way to get in touch.
          */}
          <CalloutBand
            eyebrow={copy.calloutEyebrow}
            heading={copy.calloutHeading}
            body={copy.calloutBody}
            actionLabel="Partner enquiry"
            actionHref={null}
            inertNote="The enquiry form is not built yet."
          >
            <p className="text-[13px] font-light leading-relaxed text-white/70">
              In the meantime, email{" "}
              <a
                href={`mailto:${talentLabEdition.contactEmail}`}
                className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                {talentLabEdition.contactEmail}
              </a>
              .
            </p>
          </CalloutBand>
        </div>
      </PageSection>
    </div>
  );
}
