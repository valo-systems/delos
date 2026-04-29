import Image from "next/image";

type Props = {
  /** Pixel size of the rendered square. */
  size?: number;
  /** 0–1, how visible the seal is. Defaults to subtle. */
  opacity?: number;
  /** Extra Tailwind classes for positioning, blur, mix-blend etc. */
  className?: string;
  /** When true, render purely decorative (alt="" + aria-hidden). */
  decorative?: boolean;
};

/**
 * The circular Greek-border seal. Designed to be used as a watermark/decorative
 * element behind hero or footer content. Never as the primary navbar logo.
 *
 * Defaults to decorative + low opacity so it's hard to misuse loudly.
 */
export default function BrandSeal({
  size = 480,
  opacity = 0.08,
  className,
  decorative = true,
}: Props) {
  return (
    <Image
      src="/brand/delos-seal.png"
      alt={decorative ? "" : "Delos circular brand seal"}
      aria-hidden={decorative ? true : undefined}
      width={size}
      height={size}
      loading="lazy"
      style={{ opacity }}
      className={className}
      sizes={`${size}px`}
    />
  );
}
