"""
Process supplied JPEG brand assets into clean web-ready PNGs.

The supplied assets are gold-on-white JPEGs. For a premium dark-themed site
we need transparent backgrounds. This script:

  1. Removes near-white background by alpha-keying.
  2. Trims tight bounding box around the artwork.
  3. Saves PNGs into /public/brand/ ready for next/image consumption.
  4. Generates favicon / app icon sizes from the lion head crop.

This is a *transitional* pipeline. The brand pack note explicitly recommends
final SVG exports before launch — these PNGs are good enough for web but they
are not vector and will not scale infinitely.
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets"
DEST_PUBLIC = ROOT / "public" / "brand"
DEST_APP = ROOT / "src" / "app"
DEST_PUBLIC.mkdir(parents=True, exist_ok=True)


def keyout_white(img: Image.Image, threshold: int = 235, soft: int = 25) -> Image.Image:
    """Convert near-white pixels to transparent with a soft edge.

    Pixels above `threshold` brightness become fully transparent.
    Pixels between `threshold - soft` and `threshold` ramp to transparent
    so we don't get a hard halo around the gold strokes.
    """
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    lo = threshold - soft
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            brightness = max(r, g, b)
            if brightness >= threshold:
                px[x, y] = (r, g, b, 0)
            elif brightness > lo:
                # Linear ramp — closer to threshold = more transparent
                a = int(255 * (threshold - brightness) / soft)
                px[x, y] = (r, g, b, a)
    return img


def trim(img: Image.Image, padding: int = 8) -> Image.Image:
    """Trim transparent border, leaving a small breathing pad."""
    bbox = img.getbbox()
    if not bbox:
        return img
    cropped = img.crop(bbox)
    if padding <= 0:
        return cropped
    w, h = cropped.size
    canvas = Image.new("RGBA", (w + padding * 2, h + padding * 2), (0, 0, 0, 0))
    canvas.paste(cropped, (padding, padding), cropped)
    return canvas


def save_png(img: Image.Image, path: Path) -> None:
    img.save(path, "PNG", optimize=True)
    print(f"  -> {path.relative_to(ROOT)}  ({img.size[0]}x{img.size[1]}, {path.stat().st_size // 1024}kb)")


def process_wordmark():
    print("Wordmark (primary navbar/footer logo)")
    src = SRC / "website" / "delos-logo-primary.jpeg"
    img = Image.open(src)
    img = keyout_white(img)
    img = trim(img, padding=12)
    # Cap width at 1200 — plenty for retina nav usage.
    if img.width > 1200:
        ratio = 1200 / img.width
        img = img.resize((1200, int(img.height * ratio)), Image.LANCZOS)
    save_png(img, DEST_PUBLIC / "delos-wordmark.png")


def process_seal():
    print("Circular seal (decorative)")
    src = SRC / "website" / "delos-secondary-seal.jpeg"
    img = Image.open(src)
    img = keyout_white(img)
    img = trim(img, padding=4)
    if img.width > 1024:
        ratio = 1024 / img.width
        img = img.resize((1024, int(img.height * ratio)), Image.LANCZOS)
    save_png(img, DEST_PUBLIC / "delos-seal.png")


def process_hero_artwork():
    print("Full Greek/lion artwork (optional hero)")
    src = SRC / "hero-candidates" / "hero-candidate-full-greek-lion-illustration.jpeg"
    img = Image.open(src)
    img = keyout_white(img, threshold=240, soft=20)
    img = trim(img, padding=8)
    if img.width > 1600:
        ratio = 1600 / img.width
        img = img.resize((1600, int(img.height * ratio)), Image.LANCZOS)
    save_png(img, DEST_PUBLIC / "delos-hero-artwork.png")


def crop_lion_head(img: Image.Image) -> Image.Image:
    """The supplied lion lockup is lion-head + DELOS wordmark stacked.
    For the icon we want just the lion head (top portion).
    """
    img = img.convert("RGBA")
    img = keyout_white(img)
    bbox = img.getbbox()
    if not bbox:
        return img
    img = img.crop(bbox)
    w, h = img.size
    # Lion head occupies the top ~70% of the trimmed lockup; the wordmark
    # below is small and we don't want it in the icon.
    head = img.crop((0, 0, w, int(h * 0.70)))
    head = trim(head, padding=8)
    # Square-pad so it renders cleanly inside circular favicons.
    side = max(head.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(head, ((side - head.width) // 2, (side - head.height) // 2), head)
    return canvas


def process_lion_icon():
    print("Lion head icon (favicon source)")
    src = SRC / "website" / "delos-lion-lockup.jpeg"
    img = Image.open(src)
    head = crop_lion_head(img)
    if head.width > 1024:
        head = head.resize((1024, 1024), Image.LANCZOS)
    save_png(head, DEST_PUBLIC / "delos-lion-icon.png")
    return head


def make_dark_icon(head: Image.Image, size: int) -> Image.Image:
    """Compose the gold lion on a dark charcoal square — what favicons need."""
    head = head.copy()
    if head.size != (size, size):
        head = head.resize((size, size), Image.LANCZOS)
    bg = Image.new("RGBA", (size, size), (12, 12, 12, 255))  # #0C0C0C
    bg.paste(head, (0, 0), head)
    return bg.convert("RGB")


def write_favicons(head: Image.Image):
    print("Favicons / app icons")
    # Next.js 16 App Router convention: app/icon.png + app/apple-icon.png
    icon = make_dark_icon(head, 512)
    apple = make_dark_icon(head, 180)
    icon.save(DEST_APP / "icon.png", "PNG", optimize=True)
    apple.save(DEST_APP / "apple-icon.png", "PNG", optimize=True)
    print(f"  -> src/app/icon.png (512)")
    print(f"  -> src/app/apple-icon.png (180)")
    # Also drop a static favicon.ico for legacy crawlers.
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [make_dark_icon(head, s[0]) for s in ico_sizes]
    ico_imgs[0].save(
        ROOT / "public" / "favicon.ico",
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_imgs[1:],
    )
    print(f"  -> public/favicon.ico (16/32/48)")
    # Android chrome icons + manifest
    for sz in (192, 512):
        make_dark_icon(head, sz).save(
            ROOT / "public" / f"android-chrome-{sz}x{sz}.png", "PNG", optimize=True
        )
        print(f"  -> public/android-chrome-{sz}x{sz}.png")


def main():
    process_wordmark()
    process_seal()
    process_hero_artwork()
    head = process_lion_icon()
    write_favicons(head)
    print("Done.")


if __name__ == "__main__":
    main()
