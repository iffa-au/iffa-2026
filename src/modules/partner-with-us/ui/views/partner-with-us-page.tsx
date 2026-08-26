"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { FIELD_KEYS } from "@/lib/email/field-keys";
import { partnershipTiers, partnerBenefits } from "../../data/partner-data";
import {
  fetchPartners,
  groupByTier,
  type Partner,
  type PartnerTier,
} from "../../lib/partners";

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

type FormData = {
  company_name: string;
  company_url: string;
  sender_name: string;
  sender_email: string;
  phone: string;
  interested_tier: string;
  message: string;
};

const emptyForm: FormData = {
  company_name: "",
  company_url: "",
  sender_name: "",
  sender_email: "",
  phone: "",
  interested_tier: "",
  message: "",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/35 transition-colors focus:border-yellow-500/60 focus:outline-none focus:ring-1 focus:ring-yellow-500/30";

/** Logo scale per tier — the visual hierarchy the tier copy describes. */
const TIER_LAYOUT: Record<
  PartnerTier,
  { label: string; grid: string; height: string }
> = {
  PRESENTING: {
    label: "Presenting Partner",
    grid: "grid-cols-1 sm:grid-cols-2",
    height: "h-44 sm:h-52",
  },
  CULTURAL: {
    label: "Cultural Partners",
    grid: "grid-cols-2 sm:grid-cols-3",
    height: "h-32 sm:h-40",
  },
  SUPPORTING: {
    label: "Supporting Partners",
    grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    height: "h-24 sm:h-28",
  },
};

const TIER_ORDER: PartnerTier[] = ["PRESENTING", "CULTURAL", "SUPPORTING"];

function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-500">
        {eyebrow}
      </span>
      <h2
        className="mt-3 text-3xl font-bold text-white sm:text-4xl"
        style={{ fontFamily: SERIF }}
      >
        {title}
      </h2>
      <div
        className={`mt-5 h-px w-16 bg-gradient-to-r from-yellow-500 to-transparent ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}

function PartnerLogo({ partner, height }: { partner: Partner; height: string }) {
  const [failed, setFailed] = useState(false);

  const inner = (
    <div
      className={`flex ${height} items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-yellow-500/30 hover:bg-white/[0.07]`}
    >
      {failed ? (
        <span className="px-2 text-center text-sm font-medium text-white/70">
          {partner.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="max-h-[75%] max-w-[85%] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );

  if (!partner.websiteUrl) return inner;

  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} (opens in a new tab)`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {inner}
    </a>
  );
}

export function PartnerWithUsPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [heroFailed, setHeroFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setPartners(await fetchPartners(controller.signal));
      } catch {
        // A partner-list failure shouldn't take down the enquiry form, which
        // is the page's actual conversion point — just render without logos.
        setPartners([]);
      }
    })();
    return () => controller.abort();
  }, []);

  const grouped = groupByTier(partners);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.interested_tier) {
      setStatus("Please select a partnership tier.");
      return;
    }
    if (!formRef.current) return;

    setStatus("Sending...");

    try {
      await sendConfirmationEmails({
        formType: "partner",
        submitterEmail: formData.sender_email,
        submitterName: formData.sender_name,
        fields: {
          "Company Name": formData.company_name,
          "Company URL": formData.company_url,
          [FIELD_KEYS.FULL_NAME]: formData.sender_name,
          [FIELD_KEYS.EMAIL]: formData.sender_email,
          [FIELD_KEYS.PHONE_NUMBER]: formData.phone,
          "Interested Tier": formData.interested_tier,
          [FIELD_KEYS.MESSAGE]: formData.message,
        },
      });

      setStatus("success");
      setShowSuccessModal(true);
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero — the background photo is optional by design: the whole
          public/images directory was deleted from the repo in May 2026, so
          this path currently 404s. The gradient + grain below stands on its
          own, and the photo layers back in automatically if it's restored. */}
      <section className="relative h-[420px] w-full overflow-hidden bg-[#0b0a08] sm:h-[520px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(234,179,8,0.18),transparent_60%)]" />
        {!heroFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/Partners/hero.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHeroFailed(true)}
          />
        )}
        {/* Darkest on the left, where the headline sits — the right half stays
            open so the venue and IFFA stage branding still read. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-8">
            <span className="inline-flex items-center rounded bg-yellow-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-black">
              Partner With IFFA
            </span>
            <h1
              className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              Partners &amp; Supporters
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              A global platform positioning Australia as a leader in cinema, culture, and
              creativity — built with partners who share that ambition.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-left sm:px-8 sm:text-center">
          <p className="text-lg leading-[1.9] text-white/75">
            The Annual Excellence Awards is more than a celebration — it is a global
            platform. Our partners drive an internationally recognised event that delivers
            measurable ROI, maximises brand visibility, and strengthens Australia&apos;s
            reputation as a hub for world-class events and innovation.
          </p>
        </div>
      </section>

      {/* Our partners, grouped by tier */}
      {partners.length > 0 && (
        <section className="border-t border-white/[0.06] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <SectionHeading eyebrow="Our Partners" title="Trusted By" align="center" />

            <div className="mt-14 space-y-14">
              {TIER_ORDER.map((tier) => {
                const items = grouped[tier];
                if (items.length === 0) return null;
                const layout = TIER_LAYOUT[tier];

                return (
                  <div key={tier}>
                    <div className="mb-6 flex items-center gap-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-yellow-500/90">
                        {layout.label}
                      </h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className={`grid gap-5 ${layout.grid}`}>
                      {items.map((partner) => (
                        <PartnerLogo
                          key={partner.id}
                          partner={partner}
                          height={layout.height}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Partnership tiers */}
      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <SectionHeading eyebrow="Opportunities" title="Partnership Tiers" />

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {partnershipTiers.map(({ tier, title, description }, index) => (
              <article
                key={tier}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-yellow-500/30"
              >
                <span className="text-sm font-bold text-yellow-500/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-3 text-2xl font-bold text-white"
                  style={{ fontFamily: SERIF }}
                >
                  {title}
                </h3>
                <div className="mt-4 h-px w-10 bg-yellow-500/50" />
                <p className="mt-5 text-sm leading-[1.85] text-white/65">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_1.15fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="Why IFFA" title="A Global Gateway" />
              <p className="mt-8 text-base leading-[1.9] text-white/70">
                The IFFA Awards Night is a platform for global collaboration, brand
                leadership, and high-impact investment. By uniting world cinema,
                international brands, and influential leaders, IFFA offers cross-border
                partnerships that enhance your global positioning and deliver measurable
                business value.
              </p>
              <p className="mt-5 text-base leading-[1.9] text-white/70">
                Beyond brand growth, partners contribute to cultural diplomacy, tourism,
                and Australia&apos;s creative and hospitality sectors — reinforcing its
                reputation as a world-class destination for arts and innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {partnerBenefits.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
                    <Check className="h-4 w-4 text-yellow-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <SectionHeading eyebrow="Get In Touch" title="Become a Partner" align="center" />
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-white/55">
            Tell us about your organisation and the tier you&apos;re interested in. Our
            partnerships team will be in touch within 2–3 business days.
          </p>

          <form ref={formRef} onSubmit={sendEmail} className="mt-12 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                className={INPUT_CLASS}
                type="text"
                name="sender_name"
                placeholder="Full Name"
                value={formData.sender_name}
                onChange={handleInputChange}
                required
              />
              <input
                className={INPUT_CLASS}
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <input
              className={INPUT_CLASS}
              type="email"
              name="sender_email"
              placeholder="Email Address"
              value={formData.sender_email}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input
                className={INPUT_CLASS}
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
              <input
                className={INPUT_CLASS}
                type="url"
                name="company_url"
                placeholder="Company Website"
                value={formData.company_url}
                onChange={handleInputChange}
                required
              />
            </div>

            <select
              name="interested_tier"
              value={formData.interested_tier}
              onChange={handleInputChange}
              required
              className={INPUT_CLASS}
            >
              <option value="" disabled>
                Select Partnership Tier
              </option>
              <option value="1">Presenting Partner</option>
              <option value="2">Cultural Partner</option>
              <option value="3">Supporting Partners</option>
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your organisation and what you'd like to achieve"
              required
              rows={6}
              className={`${INPUT_CLASS} resize-none leading-relaxed`}
            />

            <button
              type="submit"
              disabled={status === "Sending..."}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-yellow-400 disabled:opacity-50"
            >
              {status === "Sending..." ? "Sending..." : "Send Request"}
              {status !== "Sending..." && <ArrowRight className="h-4 w-4" />}
            </button>

            {status === "error" && (
              <p className="text-center text-sm text-red-400">
                Failed to send message. Please try again.
              </p>
            )}
            {status &&
              status !== "Sending..." &&
              status !== "success" &&
              status !== "error" && (
                <p className="text-center text-sm text-red-400">{status}</p>
              )}
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0b08] p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
                <Check className="h-7 w-7 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: SERIF }}>
                Partnership Inquiry Received
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Thank you for your interest. Our team will review your request and get back
                to you within 2–3 business days.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-7 w-full rounded-lg bg-yellow-500 px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-yellow-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
