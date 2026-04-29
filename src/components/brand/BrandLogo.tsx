import Image from "next/image";

import { siteConfig } from "@/lib/siteConfig";

type Variant = "wordmark" | "lion";

type Props = {
  /** wordmark = horizontal Delos Lounge & Dining logo. lion = head-only mark. */
  variant?: Variant;
  /** Rendered height in CSS pixels. Width is derived from the asset's aspect. */
  height?: number;
  /** Use priority loading (only enable for the above-the-fold header logo). */
  priority?: boolean;
  /** Optional class wrapping the <img>. */
  className?: string;
};

const SOURCES: Record<Variant, { src: string; intrinsic: { w: number; h: number } }> = {
  wordmark: {
    src: "/brand/delos-wordmark.png",
    intrinsic: { w: 1091, h: 391 },
  },
  lion: {
    src: "/brand/delos-lion-icon.png",
    intrinsic: { w: 627, h: 627 },
  },
};

/**
 * Site-wide brand logo. Renders next/image with the right aspect ratio and
 * pre-set alt text so we can't accidentally ship the navbar logo with no alt.
 */
export default function BrandLogo({
  variant = "wordmark",
  height = 40,
  priority = false,
  className,
}: Props) {
  const { src, intrinsic } = SOURCES[variant];
  const width = Math.round((intrinsic.w / intrinsic.h) * height);
  const alt =
    variant === "wordmark"
      ? `${siteConfig.name}. Premium African dining in Morningside, Durban`
      : `${siteConfig.shortName} lion mark`;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={`${width}px`}
    />
  );
}
