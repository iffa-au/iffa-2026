"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { partnerLogos, partnershipTiers } from "../../data/partner-data";

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

export function PartnerWithUsPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);

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
      await emailjs.sendForm(
        "service_sx058wl",
        "template_l0yivqg",
        formRef.current,
        "YaVecTMmUJA_vz_f9"
      );
      setStatus("success");
      setShowSuccessModal(true);
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 pt-28">
      <Image
        src="/images/Partners/hero.jpg"
        alt="Partners Hero"
        width={1400}
        height={600}
        className="w-full rounded-lg shadow-2xl object-cover"
        priority
      />

      <div className="container max-w-6xl mx-auto mt-16 space-y-16">

        {/* Intro */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500">
            Partners &amp; Supporters
          </h1>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            The Annual Excellence Awards is more than a celebration — it is a global
            platform that positions Australia as a leader in cinema, culture, and
            creativity. Our partners are central to this vision. Their support drives an
            internationally recognized event that delivers measurable ROI, maximizes
            brand visibility, and strengthens Australia&apos;s reputation as a hub for
            world-class events and innovation. Together, we create a legacy that
            benefits industries, communities, and the nation&apos;s global profile.
          </p>
        </div>

        {/* Partnership tiers */}
        {partnershipTiers.map(({ title, description }) => (
          <div key={title} className="space-y-4">
            <h2 className="text-3xl font-semibold text-yellow-500">{title}</h2>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>
        ))}

        <div className="border-t border-gray-800" />

        {/* Why Partner section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-yellow-500">Partner With IFFA</h2>
          <p className="text-gray-300 leading-relaxed">
            <strong>A Global Gateway for Strategic Investment</strong>
            <br />
            The IFFA Awards Night is more than a celebration of cinema — it is a{" "}
            <strong>
              platform for global collaboration, brand leadership, and high-impact investment
            </strong>
            . By uniting world cinema, international brands, and influential leaders, IFFA
            offers unique opportunities for cross-border partnerships that enhance your global
            positioning and deliver measurable business value.
          </p>
          <p className="text-gray-300 leading-relaxed">
            <strong>Unmatched Brand Engagement</strong>
            <br />
            Partnering with IFFA provides access to an elite, international audience, with
            benefits that include:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              High-impact visibility at a marquee event attended by global guests, celebrities,
              and media.
            </li>
            <li>
              Extensive digital and social media exposure connecting with audiences across
              continents.
            </li>
            <li>
              Premium brand association with{" "}
              <strong>cinematic excellence, prestige, and cultural influence.</strong>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Every partnership is designed to deliver <strong>tangible ROI</strong>, from
            strengthening brand recognition and consumer trust to positioning your organization
            as a leader in innovation, creativity, and global cultural engagement.
          </p>
          <p className="text-gray-300 leading-relaxed">
            <strong>Strategic Impact on Australia&apos;s Economy &amp; Global Standing</strong>
            <br />
            While focused on investment and brand growth, IFFA also generates measurable
            economic and cultural benefits: international visitors, tourism growth, and support
            for Australia&apos;s creative and hospitality sectors. Partners contribute to
            cultural diplomacy, global trade opportunities, and reinforce Australia&apos;s
            reputation as a world-class destination for arts, culture, and innovation.
          </p>
          <p className="text-gray-300 leading-relaxed">
            <strong>Why Partner with IFFA?</strong>
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Access to a prestigious international platform</li>
            <li>Opportunities for foreign investment &amp; cross-border collaboration</li>
            <li>Amplified brand visibility across live and digital platforms</li>
            <li>Direct contribution to economic growth and global cultural influence</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Join us as a partner and position your organization at the{" "}
            <strong>intersection of culture, commerce, and international opportunity</strong>,
            shaping the global future of cinema in Australia.
          </p>
        </div>

        <div className="border-t border-gray-800" />

        {/* Contact Form */}
        <div className="bg-gray-950 p-10 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-4 text-yellow-500">
            Become a Partner
          </h3>
          <p className="text-center text-gray-400 mb-8">
            Interested in partnering with us? Fill out the form below, and we&apos;ll be
            in touch.
          </p>

          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                type="text"
                name="sender_name"
                placeholder="Full Name"
                value={formData.sender_name}
                onChange={handleInputChange}
                required
              />
              <input
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <input
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              type="email"
              name="sender_email"
              placeholder="Email Address"
              value={formData.sender_email}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
              <input
                className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
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
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            >
              <option value="" disabled>Select Partnership Tier</option>
              <option value="1">Presenting Partner</option>
              <option value="2">Cultural Partner</option>
              <option value="3">Supporting Partners</option>
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message to us"
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition resize-none"
            />

            <button
              type="submit"
              disabled={status === "Sending..."}
              className="w-full bg-yellow-500 text-black py-4 font-semibold text-lg rounded-lg shadow-md hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {status === "Sending..." ? "Sending..." : "Send Request"}
            </button>

            {status === "error" && (
              <p className="text-center text-sm text-red-400 mt-4">
                Failed to send message. Please try again.
              </p>
            )}
            {status && status !== "Sending..." && status !== "success" && status !== "error" && (
              <p className="text-center text-sm text-red-400 mt-4">{status}</p>
            )}
          </form>
        </div>

        <div className="border-t border-gray-800" />

        {/* Partner logos */}
        <div className="py-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-[0.2em] uppercase">
              Our <span className="text-yellow-500">Partners</span>
            </h2>
            <div className="h-1 w-16 bg-yellow-500 mx-auto mt-4 opacity-80" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 h-40"
              >
                <Image
                  src={logo.url}
                  alt={logo.name}
                  width={200}
                  height={100}
                  className="max-w-[85%] max-h-[80%] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Partnership Inquiry Received!
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Thank you for your partnership inquiry! Our team will review your request and
                get back to you within 2–3 business days. We&apos;re excited about the
                possibility of working together!
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
