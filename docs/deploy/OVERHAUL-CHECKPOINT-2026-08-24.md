# Jernbane Caféen overhaul checkpoint

Dato: 2026-08-24
Projekt: `jernbanecafeen`

## Status

Dette checkpoint er den nye overhaul lokalt på branch `seo/go-live-pakke-2026-08-22`.
Det er ikke promoted til production endnu.

- Nuværende production-release før overhaul: `2a21419`
- Nuværende production-alias: https://jernbanecafeen.vercel.app
- Sikker production-rollback: se `ROLLBACK-2026-08-24.md`

## Hvad checkpointet ændrer

- Ny forsidekomposition, ikke det tidligere split-layout.
- Ny typografisk retning med display-type, mono-metadata og større editorial hierarki.
- Signal-gul, mørk grøn-sort og tomatrød som tydeligt farvesystem.
- Sticky navigation skifter logo/farve efter sektionen under den.
- CSS-marquee, reveal-animationer, billed-zoom og stationsmetadata.
- Samme logo, CMS-felter, formular-endpoint og kontaktdata bevaret.

## Rollback

Hvis overhaul-checkpointet senere deployes og skal rulles tilbage, promoveres den
registrerede Vercel-deployment i `ROLLBACK-2026-08-24.md`, eller den tidligere
production-release bygges igen fra commit `2a21419`.

Ingen credentials ligger i denne fil.
