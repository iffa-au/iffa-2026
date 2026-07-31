import { FaInstagram } from "react-icons/fa";

const introParagraphs = [
  "AIFFA - the Arab International Film Festival of Australia - is a dedicated cultural and cinematic platform celebrating Arab and Omani storytelling within Australia's vibrant creative landscape.",
  "Initiated by the Oman Film Society in collaboration with IFFA, AIFFA serves as a dynamic bridge between the Arab world and Australia, showcasing powerful narratives, emerging voices, and culturally significant works from across the region.",
  "More than a film screening event, AIFFA operates as a structured platform for cultural diplomacy, industry engagement, and creative development.",
];

const leaders = [
  {
    name: "TBA",
    title: "TBA",
    instagram: "",
    instagramUrl: "",
    initials: "?",
    bio: "Details coming soon.",
    image: "",
    imagePosition: "center",
  },
  {
    name: "Fahad Al Maimani",
    title: "Lecturer, Filmmaking | Board Member, Oman Film Society",
    instagram: "@fahadmaimani",
    instagramUrl: "https://www.instagram.com/fahadmaimani",
    initials: "FM",
    bio: "Fahad Al Maimani is an Omani academic, filmmaker, and cultural leader dedicated to advancing film education and independent cinema in Oman. He serves as a Lecturer in Filmmaking at the University of Technology and Applied Sciences (UTAS), where he contributes to the academic and practical development of emerging filmmakers.",
    image: "/assets/leaders/Fahad.webp",
    imagePosition: "center 20%",
  },
  {
    name: "Mohammed bin Abdullah Al-Ajmi",
    title: "Chairman, Oman Film Society | CEO, Silver Lens Production",
    instagram: "@alajmiphoto",
    instagramUrl: "https://www.instagram.com/alajmiphoto",
    initials: "MA",
    bio: "Mohammed bin Abdullah Al-Ajmi is an Omani filmmaker, cinematographer, and cultural leader committed to developing the film industry in Oman and across the Arab region. He serves as Chairman of the Oman Film Society and CEO of Silver Lens Production, where he supports emerging filmmakers and promotes Omani cinema internationally.",
    image: "/assets/leaders/Abdullah.webp",
    imagePosition: "center",
  },
];

const focusAreas = [
  {
    title: "Curated Film Screenings",
    description:
      "Presenting feature films, documentaries, short films, and independent productions that reflect the diversity and richness of Arab cinema.",
  },
  {
    title: "Workshops & Masterclasses",
    description:
      "Hosting professional development sessions led by filmmakers and industry experts to strengthen skills across directing, producing, writing, and distribution.",
  },
  {
    title: "Mentorship & Capacity Building",
    description:
      "Supporting emerging filmmakers through mentorship programmes, training initiatives, and structured creative guidance.",
  },
  {
    title: "Industry Networking & Market Access",
    description:
      "Creating opportunities for collaboration between Arab filmmakers and Australian producers, distributors, investors, and cultural institutions.",
  },
  {
    title: "Talent & Cultural Exchange",
    description:
      "Encouraging cross-border partnerships and co-productions between Australia, Oman, and the broader Arab region to strengthen global cultural dialogue.",
  },
];

export default function AiffaPage() {
  return (
    <section className="min-h-screen bg-black pb-16 text-white">
      <div className="border-b border-white/10 bg-[#0b0c12] py-3">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-yellow-400/80 sm:text-xs">
          Entries Open - IFFA 2026
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-yellow-400 md:text-5xl">
            Learn More About AIFFA
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-300 sm:text-sm">
            Arab International Film Festival of Australia
          </p>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-gray-300 sm:text-base">
          {introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="whitespace-nowrap text-xl font-bold uppercase tracking-[0.2em] text-white">
              Leadership & Expertise
            </h2>
            <div className="h-px w-full bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((person) => (
              <article
                key={person.name}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/5"
              >
                <div className="relative aspect-[4/5] w-full flex-shrink-0 bg-black">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      style={{ objectPosition: person.imagePosition }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-black">
                      <span className="text-5xl font-black text-yellow-400/20">
                        {person.initials}
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {person.instagramUrl && (
                    <a
                      href={person.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} on Instagram`}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-yellow-400 hover:text-black"
                    >
                      <FaInstagram className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-tight text-white">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    {person.title}
                  </p>
                  <div className="mt-3 h-px w-10 bg-yellow-400/40" />
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {person.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-white">Our Focus Areas</h2>
          <div className="space-y-4">
            {focusAreas.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="mb-2 font-semibold text-yellow-400">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
            Through strategic partnerships and curated programming, AIFFA contributes
            to tourism visibility, cultural engagement, and the sustainable growth of
            the creative industries.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            As part of the IFFA Global Network, AIFFA plays a key role in advancing
            international collaboration and elevating regional voices on a global stage.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            For detailed information regarding film submissions, participation
            opportunities, partnerships, and upcoming programmes, please visit the
            official AIFFA website:
          </p>
          <a
            href="https://www.aiffa.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-md bg-yellow-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110 sm:text-sm"
          >
            Visit AIFFA Website
          </a>
        </div>
      </div>
    </section>
  );
}
