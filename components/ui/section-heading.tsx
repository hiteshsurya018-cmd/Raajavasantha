import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <span className={cn("eyebrow", light && "text-secondary")}>
        <span className="h-px w-6 bg-current opacity-60" />
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-4 text-balance text-[2rem] leading-[1.15] sm:text-[2.6rem]",
          light ? "text-canvas" : "text-ink dark:text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-[1.05rem] leading-relaxed", light ? "text-canvas/75" : "text-ink-soft")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
