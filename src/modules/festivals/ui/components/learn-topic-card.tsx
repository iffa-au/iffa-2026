import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Camera01Icon,
  PencilEdit01Icon,
  Briefcase01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import type { LearnTopic } from "../../data/masterclass-data";

const iconMap: Record<string, IconSvgElement> = {
  Camera01Icon,
  PencilEdit01Icon,
  Briefcase01Icon,
  UserGroupIcon,
};

export function LearnTopicCard({ topic }: { topic: LearnTopic }) {
  const icon = iconMap[topic.iconName] ?? Camera01Icon;

  return (
    <article className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-yellow-400/40">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-300/40 bg-yellow-400/10">
        <HugeiconsIcon icon={icon} size={20} color="#e6ba35" aria-hidden />
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">{topic.title}</h3>

      <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-white/70">
        {topic.description}
      </p>
    </article>
  );
}
