import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-4xl md:text-5xl font-bold mb-4",
          light ? "text-charcoal" : "text-cream"
        )}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h2>
      {align === "center" && (
        <div className="flex justify-center mb-4">
          <span className="divider-gold" />
        </div>
      )}
      {align === "left" && <span className="divider-gold mb-4 block" />}
      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
            light ? "text-charcoal/70" : "text-cream/60"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
