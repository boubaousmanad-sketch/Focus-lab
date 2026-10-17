"""Crée les versions allégées des images de coach.html (AVIF + WebP, plusieurs largeurs).

Les fichiers d’origine restent dans images/ et servent de source : relance ce script
après avoir remplacé une photo.  Usage : python3 outils/optimiser-images.py
Nécessite Pillow 11 ou plus récent (prise en charge de l’AVIF).
"""
from pathlib import Path
from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "images"

# source -> largeurs à produire (en pixels)
VARIANTES = {
    "hero-kettlebells.webp": [640, 828, 1200],
    "hero-squat-dos.webp": [640, 828, 1100],
    "seance-renforcement.webp": [450, 900],
    "seance-cardio.webp": [450, 900],
    "cover-versus.webp": [480, 960],
    "cover-build.webp": [480, 960],
    "cover-performance.webp": [480, 960],
    "seance-kettlebells.webp": [500, 1000],
    "seance-kettlebells-dos.webp": [500, 1000],
    "seance-tapis.webp": [500, 1000],
    "seance-developpe.webp": [500, 1000],
    "seance-poulie.webp": [500, 1000],
    "excuses-piste.webp": [500, 1000],
    "running-piste.webp": [600, 1100],
    "coach-squat.webp": [500, 1000],
    "logo-fp.png": [177],
    "logo-focus-on.webp": [264, 396],
}

for nom, largeurs in VARIANTES.items():
    src = Image.open(IMAGES / nom)
    src = src.convert("RGBA" if "A" in src.getbands() else "RGB")
    base = Path(nom).stem
    for w in largeurs:
        h = round(src.height * w / src.width)
        img = src if w == src.width else src.resize((w, h), Image.LANCZOS)
        img.save(IMAGES / f"{base}-{w}.avif", quality=50, speed=4)
        # À pleine largeur, le WebP d’origine sert directement de version de secours.
        if not (w == src.width and nom.endswith(".webp")):
            img.save(IMAGES / f"{base}-{w}.webp", quality=78, method=6)
        print(f"{base}-{w} ({w}×{h})")

# Icône du site : palette réduite, même rendu, fichier bien plus léger.
icone = Image.open(IMAGES / "favicon-fp.png").convert("RGBA")
icone.quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(IMAGES / "favicon-fp.png", optimize=True)
