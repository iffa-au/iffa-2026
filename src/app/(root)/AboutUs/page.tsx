import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | IFFA 2026",
  description: "About the IFFA Awards Night, recognizing excellence in global cinema.",
};

const GOLD = "#a98c4a";

const sections = [
  {
    question: "What is the IFFA Awards Night?",
    answer: "The IFFA Awards are based on merits, honouring outstanding achievements in cinema and recognising excellence across artistic and technical disciplines. The IFFA Awards Night is Australia’s most glamorous celebration of cinematic excellence and global storytelling. Each year, it transforms into a highly anticipated red-carpet event, bringing together filmmakers, actors, producers, industry leaders, and cultural influencers. With elegance, sophistication, and star power, IFFA is where creativity meets prestige, and the art of storytelling is celebrated at its finest.",
  },
  {
    question: "How does IFFA champion creativity and filmmakers’ careers?",
    answer: "IFFA is more than an awards ceremony—it is a platform for creative growth and professional advancement. Every story deserves to be seen, and every filmmaker, whether emerging or established, deserves recognition. IFFA provides filmmakers with international exposure, critical attention, and industry credibility, opening doors to collaborations, funding, and distribution opportunities worldwide.",
  },
  {
    question: "What is IFFA’s vision for Australian talent?",
    answer: "Australia’s screen industry is rich with innovation and storytelling brilliance. IFFA’s mission is to showcase this talent on a global stage, connecting Australian creators with international audiences and markets. By highlighting local talent alongside exceptional work from around the world, IFFA fosters cultural exchange, mutual inspiration, and creative synergy, elevating Australia’s profile in the global screen industry.",
  },
  {
    question: "What are the IFFA Award Categories?",
    answer: "The IFFA Awards Night recognises excellence across the entire spectrum of filmmaking, celebrating both creative and technical achievements. From outstanding performances to groundbreaking storytelling and visionary direction, IFFA honours the very best in cinema and modern screen formats.\n\nAt IFFA, we present awards across the following categories:\n\n• Best Actor in a Leading Role  \n• Best Actor in a Supporting Role  \n• Best Actress in a Leading Role  \n• Best Actress in a Supporting Role  \n• Best Animated Film  \n• Best Cinematography  \n• Best Direction  \n• Best Documentary Film  \n• Best International Feature Film  \n• Best International Short Film  \n• Best Screenplay Writing  \n• Best Original Web Series  \n• Best TV Series\n\nBy acknowledging achievements across these diverse categories, IFFA ensures that every aspect of the cinematic craft—from performance to production—is celebrated and given the global recognition it deserves.",
  },
  {
    question: "Who makes up the IFFA voting body?",
    answer: "The IFFA voting body comprises a distinguished panel of film and media professionals drawn from Australia and the international film community. The panel includes filmmakers, producers, directors, writers, actors, film critics, festival programmers, and senior industry executives. This diverse mix of creative and industry expertise ensures that all film submissions are assessed fairly and judged against the highest creative, technical, and professional standards.",
  },
  {
    question: "Why is IFFA recognition so impactful?",
    answer: "Being nominated or winning at IFFA is a career milestone. Past honourees have leveraged their recognition to achieve greater success both in Australia and internationally. The awards provide exposure to industry leaders, sponsorship opportunities, expanded audiences, and mentorship through panels, networking events, and professional development programs, extending the impact well beyond the ceremony itself.",
  },
  {
    question: "What Makes the IFFA Trophy the Ultimate Honour in World Cinema?",
    answer: "The IFFA Trophy stands as a timeless symbol of cinematic brilliance and international collaboration. Rising 350mm in height and weighing 2.2 kilograms, it embodies the grace, strength, and creative spirit that define the world of film.\n\nEach trophy is meticulously cast with a bronze base, representing endurance and authenticity. Its form is then polished with 18-carat gold, giving it a radiant glow that mirrors the passion and artistry of those it honours.\n\nThe IFFA Trophy is more than an accolade — it is a celebration of visionaries who inspire through storytelling. Its sleek and modern design reflects both innovation and tradition, paying tribute to the evolving global film landscape while honouring the artistry that unites cultures.\n\nStanding proudly, the IFFA Trophy represents not just recognition, but legacy — a mark of distinction for those who continue to elevate cinema on the world stage.",
  },
  {
    question: "How does IFFA reach a global audience?",
    answer: "IFFA uses a powerful network of media partners, streaming platforms, and social media campaigns to promote nominated and winning films to more than 200 million viewers worldwide. Our coverage spans traditional press, digital marketing, influencer partnerships, and broadcast channels, amplifying filmmakers’ voices far beyond the red carpet.",
  },
  {
    question: "What makes IFFA Australia’s most stylish screen event?",
    answer: "IFFA is synonymous with red carpet glamour, high-profile hosts, live entertainment, and exclusive after-parties. The event attracts celebrities, creative powerhouses, and VIPs, generating extensive media buzz across television and social platforms. Each year, IFFA delivers a unique, immersive experience that celebrates both industry excellence and Australia’s vibrant cultural scene.",
  },
  {
    question: "How does IFFA shape the future of cinema?",
    answer: "In an era of rapid technological change, IFFA supports innovation, artistic integrity, and original storytelling. By celebrating risk-taking, diverse voices, and inclusive perspectives, we encourage filmmakers to push boundaries. This commitment cultivates a dynamic, representative, and globally influential screen industry.",
  },
  {
    question: "Who can participate in IFFA?",
    answer: "IFFA welcomes filmmakers, producers, actors, documentarians, and digital creators worldwide. We seek submissions that embody creativity, originality, and impact, across a wide variety of genres and formats. Participants gain prestigious recognition, global exposure, and access to IFFA’s extensive networks, fostering career growth and international collaboration.",
  },
  {
    question: "Why join IFFA Awards Night?",
    answer: "IFFA is a celebration of cinematic heritage, contemporary creativity, and future possibilities. It honours the storytellers shaping cultural dialogue while championing the innovation driving the industry forward. Join us for a night of glamour, inspiration, and opportunity—where your story takes its rightful place among the best in global cinema.\n\nIFFA Awards Night — Where Glamour Meets Cinematic Greatness.",
  },
  {
    question: "How can I submit my film to IFFA?",
    answer: (
      <>
        Start by completing the submission form here:{" "}
        <Link href="/submit-film" className="text-[#a98c4a] hover:underline transition-colors font-medium">
          Submit a Film
        </Link>
        <br /> Submit the Film Enquiry form here:{" "}
        <Link href="/submit-film-enquiry" className="text-[#a98c4a] hover:underline transition-colors font-medium">
          Submit Film Enquiry
        </Link>
      </>
    ),
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#a98c4a]/10 to-transparent -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-[10%] flex flex-col gap-16 relative z-10">
        {/* Header */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#a98c4a]">
            About IFFA Awards Night
          </h1>
          <div className="w-24 h-1.5 bg-[#a98c4a] mx-auto rounded-full opacity-80" />
        </header>

        {/* Content */}
        <div className="grid gap-10">
          {sections.map((section, index) => (
            <section 
              key={index} 
              className="flex flex-col gap-5 max-w-7xl mx-auto w-full p-8 md:p-10 rounded-2xl border border-white/10 dark:border-white/5 bg-black/40 dark:bg-white/5 backdrop-blur-md shadow-2xl transition hover:border-[#a98c4a]/40"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-[#a98c4a] leading-tight">
                {section.question}
              </h2>
              <div className="text-muted-foreground whitespace-pre-line text-justify leading-relaxed text-sm md:text-base">
                {section.answer}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}