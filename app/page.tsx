"use client";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingBag,
  X,
  Menu,
  Plus,
  Minus,
  ChevronDown,
  Check,
  MoveDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { img, moments, photos } from "./photos";
type Panel = "search" | "bag" | "product" | "menu" | "journal" | "care" | null;
type Language = "en" | "fr";
const assets = {
  hero: "/assets/hero-clear.webp",
  hero4k: "/assets/hero-4k.webp",
  bottle: "/assets/bottle-hd.webp",
};
const bottleSrcSet = `/assets/bottle-clear.webp 1086w, ${assets.bottle} 2172w`;
const noteImages = [photos.notePeach, photos.noteJasmine, photos.noteWood];
const moods = [
  { key: "dusk", bg: "linear-gradient(160deg,#f3c79e 0%,#d98a5a 55%,#7a3f22 100%)" },
  { key: "ivory", bg: "linear-gradient(160deg,#fbf4e6 0%,#efdcc3 60%,#d9b893 100%)" },
  { key: "bloom", bg: "linear-gradient(160deg,#f8d9cf 0%,#eab49f 55%,#b8705a 100%)" },
] as const;
const hotspots = [
  { x: 50, y: 12, note: 0 },
  { x: 30, y: 52, note: 1 },
  { x: 68, y: 78, note: 2 },
];
const finePointer = () =>
  matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;
/** Pointer-driven 3D tilt with a moving light sheen (desktop only). */
function tilt(e: React.PointerEvent<HTMLElement>, depth = 10) {
  if (e.pointerType !== "mouse" || !finePointer()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--gx", `${px * 100}%`);
  el.style.setProperty("--gy", `${py * 100}%`);
  gsap.to(el, {
    rotateY: (px - 0.5) * depth,
    rotateX: (0.5 - py) * depth,
    transformPerspective: 900,
    duration: 0.6,
    ease: "power3.out",
  });
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
}
/** Buttons drift gently towards the pointer. */
function magnet(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || !finePointer()) return;
  const r = e.currentTarget.getBoundingClientRect();
  gsap.to(e.currentTarget, {
    x: (e.clientX - r.left - r.width / 2) * 0.25,
    y: (e.clientY - r.top - r.height / 2) * 0.35,
    duration: 0.5,
    ease: "power3.out",
  });
}
function unmagnet(e: React.PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
}
const content = {
  en: {
    collections: "Collections",
    shop: "Shop",
    story: "Our story",
    journal: "Journal",
    language: "Language",
    heroOne: "The essence of",
    heroTwo: "subtle romance",
    heroCopy:
      "A luminous blend of peach, jasmine and soft woods. Crafted for moments that stay with you.",
    explore: "Explore the collection",
    scroll: "A world of quiet wonder",
    label: "The art of feeling",
    statement:
      "A touch of peach. A whisper of jasmine. The warmth of soft woods. Éclat is a little golden light, held close to the skin.",
    storySmall:
      "An invitation to slow down. To notice the light. To carry a beautiful moment with you.",
    notesLabel: "The composition",
    notesTitle: "A feeling, in three notes.",
    peach: "Sun-warmed peach",
    peachSub: "The first impression",
    peachCopy:
      "Luminous and softly sweet. A golden opening, like the last light of a summer afternoon.",
    jasmine: "A whisper of jasmine",
    jasmineSub: "At the heart",
    jasmineCopy:
      "Delicate white petals. An intimate floral heart that unfolds gently against the skin.",
    wood: "The warmth of woods",
    woodSub: "What stays with you",
    woodCopy:
      "Soft, quietly enveloping woods. A warm finish that turns a passing moment into a memory.",
    signature: "The signature fragrance",
    bottleTitle: "Golden light.\nBottled.",
    bottleCopy:
      "Éclat captures the beauty of an unhurried moment. Luminous peach meets jasmine, settling into the quiet warmth of soft woods.",
    discover: "Discover Éclat",
    scent: "Floral · Fruity · Woody",
    eau: "Eau de parfum",
    size: "100 ml / 3.4 fl. oz.",
    worldLabel: "The world of VELORA",
    worldTitle: "For moments\nthat stay.",
    worldCopy:
      "A fragrance can hold a place, a feeling, a fleeting instant. VELORA is an ode to those small, beautiful things — warm light on stone, flowers in the evening, a memory you return to.",
    worldCta: "Enter our world",
    journalLabel: "Notes from the maison",
    journalTitle: "The beauty of the everyday.",
    articleOne: "The poetry of golden hour",
    articleTwo: "A fragrance, worn your way",
    read: "Read the story",
    closing: "Leave a little\nof yourself.",
    closingCta: "Find your signature",
    footerLine: "Fragrance for moments that stay with you.",
    back: "Back to the beginning",
    care: "Fragrance care",
    privacy: "Privacy & your bag",
    searchTitle: "What speaks to you?",
    searchPlaceholder: "Search Éclat, peach, jasmine…",
    searchEmpty: "No matches. Try Éclat, peach, jasmine, woods or our story.",
    bagTitle: "Your selection",
    bagEmpty: "A little beauty awaits.",
    bagEmptyCopy: "Discover Éclat and add it to your selection.",
    add: "Add to bag",
    added: "Added to your bag",
    remove: "Remove",
    save: "Save your selection",
    saved: "Your selection has been downloaded.",
    purchaseInfo:
      "Online ordering is not open yet. Save your selection to keep your fragrance details.",
    quantity: "Quantity",
    noteTabs: ["Opening", "Heart", "Trail"],
    introTag: "The essence of subtle romance",
    momentsLabel: "Moments that stay",
    momentsTitle: "Collected in\ngolden light.",
    momentsCopy: "Seven small beauties that shaped Éclat. Scroll, drag or use the arrows.",
    moodLabel: "Set the light",
    moods: ["Dusk", "Ivory", "Bloom"],
    explorePoints: "Touch the points to explore the composition",
    view: "View",
    read2: "Read",
    open: "Open",
    marquee: ["Sun-warmed peach", "White jasmine", "Soft woods", "Golden hour", "Eau de parfum"],
    photoCredit: "Photography",
  },
  fr: {
    collections: "Collections",
    shop: "Boutique",
    story: "Notre histoire",
    journal: "Journal",
    language: "Langue",
    heroOne: "L’essence d’une",
    heroTwo: "douce romance",
    heroCopy:
      "Un accord lumineux de pêche, de jasmin et de bois doux. Pour les instants qui restent.",
    explore: "Explorer la collection",
    scroll: "Un monde de douceur",
    label: "L’art de ressentir",
    statement:
      "Une touche de pêche. Un souffle de jasmin. La chaleur des bois doux. Éclat est une lumière dorée, tout près de la peau.",
    storySmall:
      "Une invitation à ralentir. À regarder la lumière. À garder un bel instant près de soi.",
    notesLabel: "La composition",
    notesTitle: "Une émotion, en trois notes.",
    peach: "La pêche au soleil",
    peachSub: "La première impression",
    peachCopy:
      "Lumineuse et délicatement sucrée. Une ouverture dorée comme la dernière lumière d’un après-midi d’été.",
    jasmine: "Un souffle de jasmin",
    jasmineSub: "Au cœur",
    jasmineCopy:
      "De délicats pétales blancs. Un cœur floral intime qui s’épanouit doucement sur la peau.",
    wood: "La chaleur des bois",
    woodSub: "Ce qui reste",
    woodCopy:
      "Des bois doux et enveloppants. Une chaleur qui transforme un instant en souvenir.",
    signature: "Le parfum signature",
    bottleTitle: "La lumière dorée.\nEn flacon.",
    bottleCopy:
      "Éclat capture la beauté d’un instant suspendu. La pêche lumineuse rencontre le jasmin et s’installe dans la chaleur des bois doux.",
    discover: "Découvrir Éclat",
    scent: "Floral · Fruité · Boisé",
    eau: "Eau de parfum",
    size: "100 ml / 3,4 fl. oz.",
    worldLabel: "L’univers VELORA",
    worldTitle: "Pour les instants\nqui restent.",
    worldCopy:
      "Un parfum peut garder un lieu, une émotion, un instant. VELORA célèbre ces petites beautés : la lumière sur la pierre, les fleurs du soir, un souvenir que l’on aime retrouver.",
    worldCta: "Entrer dans notre univers",
    journalLabel: "Les notes de la maison",
    journalTitle: "La beauté du quotidien.",
    articleOne: "La poésie de l’heure dorée",
    articleTwo: "Un parfum à votre image",
    read: "Lire l’histoire",
    closing: "Laissez un peu\nde vous.",
    closingCta: "Trouver votre signature",
    footerLine: "Des parfums pour les instants qui restent.",
    back: "Retour au début",
    care: "Prendre soin du parfum",
    privacy: "Confidentialité et sélection",
    searchTitle: "Qu’est-ce qui vous inspire ?",
    searchPlaceholder: "Chercher Éclat, pêche, jasmin…",
    searchEmpty:
      "Aucun résultat. Essayez Éclat, pêche, jasmin, bois ou histoire.",
    bagTitle: "Votre sélection",
    bagEmpty: "Un peu de beauté vous attend.",
    bagEmptyCopy: "Découvrez Éclat et ajoutez-le à votre sélection.",
    add: "Ajouter au panier",
    added: "Ajouté à votre panier",
    remove: "Retirer",
    save: "Enregistrer la sélection",
    saved: "Votre sélection a été téléchargée.",
    purchaseInfo:
      "La commande en ligne n’est pas encore ouverte. Enregistrez votre sélection pour garder les détails du parfum.",
    quantity: "Quantité",
    noteTabs: ["Envolée", "Cœur", "Sillage"],
    introTag: "L’essence d’une douce romance",
    momentsLabel: "Les instants qui restent",
    momentsTitle: "Recueillis dans\nla lumière dorée.",
    momentsCopy: "Sept petites beautés qui ont inspiré Éclat. Faites défiler, glissez ou utilisez les flèches.",
    moodLabel: "Choisir la lumière",
    moods: ["Crépuscule", "Ivoire", "Floraison"],
    explorePoints: "Touchez les points pour explorer la composition",
    view: "Voir",
    read2: "Lire",
    open: "Ouvrir",
    marquee: ["Pêche au soleil", "Jasmin blanc", "Bois doux", "Heure dorée", "Eau de parfum"],
    photoCredit: "Photographie",
  },
};
/** The lotus mark, redrawn as a vector so it stays sharp at any size. */
function Lotus() {
  return (
    <svg className="brand-lotus" viewBox="0 0 64 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" strokeLinecap="round">
        <path d="M32 3.5C25.6 11.5 25.6 23.5 32 32.5C38.4 23.5 38.4 11.5 32 3.5Z" />
        <path d="M32 32.5C24.6 30.6 19.4 22.8 19.8 12.6C25.2 15.4 29.6 21.6 32 32.5Z" />
        <path d="M32 32.5C39.4 30.6 44.6 22.8 44.2 12.6C38.8 15.4 34.4 21.6 32 32.5Z" />
        <path d="M32 32.5C22.6 33.6 13.4 29 9 20.6C17.6 19.8 26.6 24.4 32 32.5Z" />
        <path d="M32 32.5C41.4 33.6 50.6 29 55 20.6C46.4 19.8 37.4 24.4 32 32.5Z" />
        <path d="M21.5 36.2Q32 39.4 42.5 36.2" />
      </g>
    </svg>
  );
}
function Brand({ rise = false }: { rise?: boolean }) {
  const part = (cls: string, children: React.ReactNode, i: number) =>
    rise ? (
      <span className={`rise-mask ${cls}-mask`}>
        <span className={`rise ${cls}`} style={{ "--d": `${0.25 + i * 0.22}s` } as React.CSSProperties}>
          {children}
        </span>
      </span>
    ) : (
      <span className={cls}>{children}</span>
    );
  return (
    <span className="brand-mark" role="img" aria-label="VELORA Paris">
      {part("brand-icon", <Lotus />, 0)}
      {rise ? (
        <span className="rise-mask brand-word-mask">
          <span className="brand-word" aria-hidden="true">
            {"VELORA".split("").map((ch, i) => (
              <span className="rise rise-letter" key={i} style={{ "--d": `${0.55 + i * 0.09}s` } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ) : (
        <span className="brand-word" aria-hidden="true">VELORA</span>
      )}
      {part("brand-sub", "PARIS", 5)}
    </span>
  );
}
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!finePointer() || !dot.current) return;
    const el = dot.current;
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, select, input");
      el.classList.toggle("is-hover", !!target);
      setLabel(target?.dataset.cursor ?? "");
    };
    const leave = () => el.classList.add("is-hidden");
    const enter = () => el.classList.remove("is-hidden");
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);
  return (
    <div ref={dot} className={`cursor ${label ? "has-label" : ""}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span className="text-mask" key={i}>
          <span className="reveal-line">{line}</span>
        </span>
      ))}
    </>
  );
}
export default function Home() {
  const [lang, setLang] = useState<Language>("en"),
    [panel, setPanel] = useState<Panel>(null),
    [query, setQuery] = useState(""),
    [bag, setBag] = useState(0),
    [note, setNote] = useState(0),
    [article, setArticle] = useState(0),
    [toast, setToast] = useState(""),
    [ready, setReady] = useState(false),
    [sticky, setSticky] = useState(false),
    [mood, setMood] = useState(0),
    [notesPaused, setNotesPaused] = useState(false),
    [notesTouched, setNotesTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    lenis = useRef<Lenis | null>(null);
  const t = content[lang];
  const notes = [
    { name: t.peach, sub: t.peachSub, copy: t.peachCopy },
    { name: t.jasmine, sub: t.jasmineSub, copy: t.jasmineCopy },
    { name: t.wood, sub: t.woodSub, copy: t.woodCopy },
  ];
  useEffect(() => {
    try {
      const b = Number(localStorage.getItem("velora-selection"));
      if (Number.isInteger(b) && b >= 0 && b <= 20) setBag(b);
      if (localStorage.getItem("velora-language") === "fr") setLang("fr");
    } catch {}
    // Smooth intro reveal before the curtain lifts.
    const timeout = setTimeout(() => setReady(true), 1800);
    const scroll = () => setSticky(window.scrollY > 60);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("velora-language", lang);
    } catch {}
  }, [lang]);
  useEffect(() => {
    // The composition gently cycles through its notes until someone takes over.
    if (notesPaused || notesTouched) return;
    const timer = setTimeout(() => setNote((n) => (n + 1) % 3), 5200);
    return () => clearTimeout(timer);
  }, [note, notesPaused, notesTouched]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (panel && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      lenis.current?.stop();
    }
    if (!panel) {
      dialog.current?.close();
      lenis.current?.start();
    }
  }, [panel]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }
    const smooth = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1,
      anchors: true,
    });
    lenis.current = smooth;
    smooth.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => smooth.raf(time * 1000);
    gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      gsap.to(".hero-photo", {
        yPercent: 15,
        scale: 1.13,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to(".hero-copy", {
        y: -110,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "15% top",
          end: "85% top",
          scrub: 0.6,
        },
      });
      gsap.to(".hero-wordmark", {
        yPercent: -28,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
      gsap.fromTo(
        ".statement-word",
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".statement",
            start: "top 82%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        },
      );
      gsap.utils.toArray<HTMLElement>(".scent-card").forEach((card, i) =>
        gsap.fromTo(
          card,
          { y: [150, 260, 170, 240][i] },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".scent-grid",
              start: "top 95%",
              end: "center 48%",
              scrub: 0.8,
            },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((el) =>
        gsap.from(el, {
          yPercent: 110,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        }),
      );
      gsap.matchMedia().add("(min-width: 800px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".signature",
            start: "top top",
            end: "+=1100",
            pin: ".signature-stage",
            scrub: 1,
          },
        });
        tl.fromTo(
          ".signature-bottle",
          { y: 55, rotation: -8, scale: 0.84 },
          { y: -25, rotation: 5, scale: 1.06, duration: 2.2, ease: "none" },
          0,
        )
          .fromTo(
            ".signature-ghost",
            { xPercent: -7 },
            { xPercent: 8, duration: 2.2, ease: "none" },
            0,
          )
          .fromTo(
            ".signature-info",
            { y: 80 },
            { y: -35, duration: 2.2, ease: "none" },
            0,
          );
      });
      gsap.matchMedia().add("(min-width: 800px)", () => {
        const track = document.querySelector<HTMLElement>(".moments-track");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".moments",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              gsap.set(".moments-progress span", { scaleX: self.progress }),
          },
        });
        gsap.utils.toArray<HTMLElement>(".moment img").forEach((image) =>
          gsap.fromTo(
            image,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          ),
        );
      });
      const skew = gsap.quickTo(".marquee-row", "skewX", { duration: 0.6, ease: "power3" });
      ScrollTrigger.create({
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) =>
          skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -260)),
        onLeave: () => skew(0),
      });
      gsap.fromTo(
        ".world-image",
        { clipPath: "inset(18% 12% 18% 12% round 12px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: ".world",
            start: "top 85%",
            end: "top 15%",
            scrub: 1,
          },
        },
      );
      gsap.utils.toArray<HTMLElement>(".journal-picture").forEach((pic) =>
        gsap.fromTo(
          pic,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.6,
            ease: "power4.out",
            scrollTrigger: { trigger: pic, start: "top 88%", once: true },
          },
        ),
      );
      gsap.fromTo(
        ".world-image img",
        { yPercent: -10, scale: 1.15 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".world",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        ".closing-image",
        { scale: 1.2 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".closing",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const timer = setTimeout(refresh, 2500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
      ctx.revert();
      smooth.destroy();
      gsap.ticker.remove(tick);
      lenis.current = null;
    };
  }, [lang]);
  useEffect(() => {
    type Tool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: "get_eclat_details",
        description:
          "Read the VELORA Éclat fragrance details. Does not place an order.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: () => ({
          name: "Éclat",
          brand: "VELORA Paris",
          concentration: "Eau de parfum",
          volume: "100 ml",
          notes: ["peach", "jasmine", "soft woods"],
          orderingAvailable: false,
        }),
      },
      {
        name: "set_fragrance_selection",
        description:
          "Set the device-local Éclat bag quantity and open the bag. Does not purchase or submit an order.",
        inputSchema: {
          type: "object",
          properties: {
            quantity: { type: "integer", minimum: 0, maximum: 20 },
          },
          required: ["quantity"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: async (input: unknown) => {
          const q = (input as { quantity?: unknown })?.quantity;
          if (typeof q !== "number" || !Number.isInteger(q) || q < 0 || q > 20)
            throw new Error("Quantity must be an integer from 0 to 20.");
          updateBag(q);
          setPanel("bag");
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          return {
            fragrance: "Éclat",
            quantity: q,
            scope: "this browser",
            orderPlaced: false,
          };
        },
      },
    ];
    for (const tool of tools) {
      try {
        Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    }
    return () => lifecycle.abort();
  }, []);
  function updateBag(value: number) {
    const next = Math.max(0, Math.min(20, value));
    setBag(next);
    try {
      localStorage.setItem("velora-selection", String(next));
    } catch {}
  }
  function add() {
    updateBag(bag + 1);
    setToast(t.added);
    setPanel("bag");
  }
  function go(id: string) {
    setPanel(null);
    setTimeout(() => {
      if (lenis.current) lenis.current.scrollTo(id, { offset: -90 });
      else
        document.querySelector(id)?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
    }, 30);
  }
  function saveBag() {
    const text = `VELORA PARIS\n\nÉCLAT — Eau de parfum\n100 ml / 3.4 fl. oz.\n${t.quantity}: ${bag}\n\nPeach · Jasmine · Soft woods\n\n${t.purchaseInfo}\n`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "VELORA-my-selection.txt";
    a.click();
    URL.revokeObjectURL(url);
    setToast(t.saved);
  }
  const searchItems = [
    {
      title: "Éclat — " + t.eau,
      sub: t.scent,
      keywords:
        "eclat éclat peach pêche jasmine jasmin woods bois fragrance parfum",
      action: () => setPanel("product"),
      image: assets.bottle,
    },
    {
      title: t.notesTitle,
      sub: t.notesLabel,
      keywords: "notes peach pêche jasmine jasmin woods bois composition",
      action: () => go("#notes"),
      image: img(photos.notePeach, "75px").src,
    },
    {
      title: t.worldTitle.replace("\n", " "),
      sub: t.story,
      keywords: "story histoire velora paris maison",
      action: () => go("#story"),
      image: img(photos.world, "75px").src,
    },
  ].filter(
    (item) =>
      !query ||
      (item.title + item.keywords).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div ref={root} className={`site ${ready ? "is-ready" : "is-loading"}`}>
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter id="velora-mark-light" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.98  0 0 0 0 0.945  0 0 0 0 0.875  -1.8 -1.8 -1.8 0 3.6"
            />
          </filter>
          <filter id="velora-mark-dark" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.259  0 0 0 0 0.173  0 0 0 0 0.125  -1.8 -1.8 -1.8 0 3.6"
            />
          </filter>
        </defs>
      </svg>
      <a className="skip-link" href="#main">
        {lang === "en" ? "Skip to content" : "Aller au contenu"}
      </a>
      <Cursor />
      <div className="intro-curtain" aria-hidden="true">
        <div className="intro-inner">
          <Brand rise />
          <span className="intro-line" />
          <span className="rise-mask">
            <span className="rise intro-tag" style={{ "--d": "1.7s" } as React.CSSProperties}>
              {t.introTag}
            </span>
          </span>
          <span className="rise-mask">
            <span className="rise eyebrow" style={{ "--d": "2s" } as React.CSSProperties}>
              ÉCLAT · EAU DE PARFUM
            </span>
          </span>
        </div>
      </div>
      <header className={`header ${sticky ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <div className="header-left">
            <button
              className="mobile-menu icon-button"
              aria-label={lang === "en" ? "Open menu" : "Ouvrir le menu"}
              onClick={() => setPanel("menu")}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <nav className="desktop-nav" aria-label="Collections">
              <a
                href="#collection"
                className="header-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  go("#collection");
                }}
              >
                {t.collections}
              </a>
              <button
                className="header-nav-link"
                onClick={() => setPanel("product")}
              >
                {t.shop}
              </button>
              <a
                href="#story"
                className="header-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  go("#story");
                }}
              >
                {t.story}
              </a>
            </nav>
          </div>

          <a
            className="header-brand"
            href="#top"
            aria-label="VELORA Paris — home"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
          >
            <Brand />
          </a>

          <div className="header-right">
            <nav className="desktop-nav-right" aria-label="Maison">
              <a
                href="#journal"
                className="header-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  go("#journal");
                }}
              >
                {t.journal}
              </a>
            </nav>
            <div className="nav-tools">
              <button
                className="icon-button header-tool-btn"
                onClick={() => setPanel("search")}
                aria-label={lang === "en" ? "Search" : "Rechercher"}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <div className="language-toggle" role="group" aria-label={t.language}>
                <button
                  type="button"
                  className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                >
                  EN
                </button>
                <span className="lang-divider">/</span>
                <button
                  type="button"
                  className={`lang-btn ${lang === "fr" ? "is-active" : ""}`}
                  onClick={() => setLang("fr")}
                  aria-pressed={lang === "fr"}
                >
                  FR
                </button>
              </div>
              <button
                className="bag-button"
                onClick={() => setPanel("bag")}
                aria-label={`${t.bagTitle} (${bag})`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="bag-badge">{bag}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div
            className="hero-scene"
            onPointerMove={(e) => {
              if (
                e.pointerType === "mouse" &&
                !matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                const rect = e.currentTarget.getBoundingClientRect();
                gsap.to(e.currentTarget, {
                  x: (e.clientX / rect.width - 0.5) * -9,
                  y: (e.clientY / rect.height - 0.5) * -5,
                  duration: 1.6,
                });
              }
            }}
            onPointerLeave={(e) =>
              gsap.to(e.currentTarget, { x: 0, y: 0, duration: 1.6 })
            }
          >
            <img
              className="hero-photo"
              src={assets.hero}
              srcSet={`${assets.hero} 1672w, ${assets.hero4k} 3840w`}
              sizes="100vw"
              alt="VELORA Éclat, surrounded by peach and jasmine in the golden light of a Mediterranean sunset"
              fetchPriority="high"
              width="1672"
              height="941"
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-copy">
            <h1 id="hero-title">
              <span className="rise-mask">
                <span className="rise" style={{ "--d": "0.35s" } as React.CSSProperties}>
                  {t.heroOne}
                </span>
              </span>
              <strong className="rise-mask">
                <span className="rise" style={{ "--d": "0.6s" } as React.CSSProperties}>
                  {t.heroTwo}
                </span>
              </strong>
            </h1>
            <span className="rise-mask">
              <p className="rise" style={{ "--d": "0.95s" } as React.CSSProperties}>
                {t.heroCopy}
              </p>
            </span>
            <a
              className="pill light hero-pill"
              onPointerMove={magnet}
              onPointerLeave={unmagnet}
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                go("#collection");
              }}
            >
              {t.explore}
              <span className="pill-dot">
                <Plus size={20} />
              </span>
            </a>
          </div>
          <div className="hero-caption">
            <span>ÉCLAT</span>
            <span>{t.eau} · 100 ml</span>
          </div>
          <span className="hero-wordmark" aria-hidden="true">
            {"velora".split("").map((ch, i) => (
              <span className="rise-mask" key={i}>
                <span className="rise" style={{ "--d": `${0.45 + i * 0.1}s` } as React.CSSProperties}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
          <button className="scroll-cue" onClick={() => go("#notes")}>
            <span>{t.scroll}</span>
            <MoveDown size={15} />
          </button>
        </section>
        <section id="notes" className="notes-section">
          <div className="story-intro">
            <div className="section-index">
              <span className="tiny-flower">✳</span>
              <span className="eyebrow">01 / {t.label}</span>
            </div>
            <div className="intro-copy">
              <span className="eyebrow">VELORA PARIS</span>
              <h2 className="statement">
                {t.statement.split(" ").map((word, i) => (
                  <span className="statement-word" key={i}>
                    {word}{" "}
                  </span>
                ))}
              </h2>
              <p>{t.storySmall}</p>
            </div>
          </div>
          <div className="scent-grid">
            {[
              { cls: "wood-card", tag: `03 / ${t.noteTabs[2]}`, photo: photos.woodCard, title: t.wood, sub: t.woodSub, note: 2 },
              { cls: "bottle-card", tag: t.signature, photo: null, title: "Éclat", sub: t.eau, note: -1 },
              { cls: "peach-card", tag: `01 / ${t.noteTabs[0]}`, photo: photos.peachCard, title: t.peach, sub: t.peachSub, note: 0 },
              { cls: "jasmine-card", tag: `02 / ${t.noteTabs[1]}`, photo: photos.jasmineCard, title: t.jasmine, sub: t.jasmineSub, note: 1 },
            ].map((card) => (
              <button
                key={card.cls}
                className={`scent-card ${card.cls}`}
                data-cursor={card.note < 0 ? t.open : t.view}
                onPointerMove={(e) => tilt(e, 12)}
                onPointerLeave={untilt}
                onClick={() => {
                  if (card.note < 0) return setPanel("product");
                  setNote(card.note);
                  setNotesTouched(true);
                  go("#composition");
                }}
              >
                <span className="card-tag">{card.tag}</span>
                {card.photo ? (
                  <div className="card-media">
                    <img {...img(card.photo, "(max-width: 799px) 50vw, 25vw")} loading="lazy" width="1200" height="1800" />
                  </div>
                ) : (
                  <div className="card-media">
                    <img
                      src={assets.bottle}
                      srcSet={bottleSrcSet}
                      sizes="(max-width: 799px) 50vw, 25vw"
                      alt="Éclat eau de parfum"
                      loading="lazy"
                      width="1086"
                      height="1448"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <span className="card-glare" aria-hidden="true" />
                <div className="card-copy">
                  <h3>{card.title}</h3>
                  <span>{card.sub}</span>
                </div>
                <span className="card-plus">
                  <Plus size={20} />
                </span>
              </button>
            ))}
          </div>
          <div className="notes-foot">
            <span>PEACH · JASMINE · SOFT WOODS</span>
            <span>LA COLLECTION ÉCLAT</span>
          </div>
        </section>
        <section
          id="collection"
          className={`signature mood-${moods[mood].key}`}
          style={{ "--mood": moods[mood].bg } as React.CSSProperties}
        >
          <div className="signature-stage">
            <span className="signature-ghost" aria-hidden="true">
              Éclat
            </span>
            <div className="signature-label">
              <span className="eyebrow">02 / {t.signature}</span>
              <span className="eyebrow">VELORA PARIS</span>
            </div>
            <div className="signature-product">
              <div
                className="bottle-stage"
                onPointerMove={(e) => tilt(e, 22)}
                onPointerLeave={untilt}
              >
                <span className="bottle-halo" aria-hidden="true" />
                <img
                  className="signature-bottle"
                  src={assets.bottle}
                  srcSet={bottleSrcSet}
                  sizes="(max-width: 799px) 80vw, 34vw"
                  alt="The VELORA Éclat fragrance bottle"
                  loading="lazy"
                  width="1086"
                  height="1448"
                />
                <span className="card-glare bottle-glare" aria-hidden="true" />
                {hotspots.map((spot) => (
                  <button
                    key={spot.note}
                    className={`hotspot ${note === spot.note ? "is-active" : ""}`}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    aria-label={notes[spot.note].name}
                    aria-pressed={note === spot.note}
                    onClick={() => {
                      setNote(spot.note);
                      setNotesTouched(true);
                    }}
                  >
                    <span className="hotspot-dot" />
                    <span className="hotspot-label">
                      <small>{String(spot.note + 1).padStart(2, "0")} · {t.noteTabs[spot.note]}</small>
                      {notes[spot.note].name}
                    </span>
                  </button>
                ))}
              </div>
              <span className="product-caption">{t.explorePoints}</span>
            </div>
            <div className="signature-info">
              <span className="eyebrow">{t.scent}</span>
              <h2>
                <Lines text={t.bottleTitle} />
              </h2>
              <p>{t.bottleCopy}</p>
              <div className="mood-picker" role="radiogroup" aria-label={t.moodLabel}>
                <span className="eyebrow">{t.moodLabel}</span>
                <div>
                  {moods.map((m, i) => (
                    <button
                      key={m.key}
                      role="radio"
                      aria-checked={mood === i}
                      className={mood === i ? "is-active" : ""}
                      onClick={() => setMood(i)}
                    >
                      <span className="mood-swatch" style={{ background: m.bg }} />
                      {t.moods[i]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="pill dark"
                onPointerMove={magnet}
                onPointerLeave={unmagnet}
                onClick={() => setPanel("product")}
              >
                {t.discover}
                <span className="pill-dot">
                  <Plus size={20} />
                </span>
              </button>
              <span className="product-size">
                {t.eau} · {t.size}
              </span>
            </div>
          </div>
        </section>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-row">
            {[0, 1].map((k) => (
              <span className="marquee-set" key={k}>
                {t.marquee.map((word) => (
                  <span key={word}>
                    {word}
                    <Lotus />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <section
          className="composition"
          id="composition"
          onPointerEnter={() => setNotesPaused(true)}
          onPointerLeave={() => setNotesPaused(false)}
        >
          <div className="composition-image" data-cursor={t.noteTabs[note]}>
            {noteImages.map((photo, i) => (
              <img
                key={photo.src}
                {...img(photo, "(max-width: 799px) 100vw, 45vw")}
                className={note === i ? "is-active" : ""}
                width="1600"
                height="2000"
                loading="lazy"
              />
            ))}
            <span className="image-caption">
              {String(note + 1).padStart(2, "0")} / 03 — {notes[note].name}
            </span>
            <span className="note-progress" aria-hidden="true">
              <span
                key={`${note}-${notesPaused || notesTouched}`}
                className={notesPaused || notesTouched ? "is-paused" : ""}
              />
            </span>
          </div>
          <div className="composition-content">
            <span className="eyebrow">{t.notesLabel}</span>
            <h2>{t.notesTitle}</h2>
            <div className="note-tabs" role="tablist" aria-label={t.notesLabel}>
              {t.noteTabs.map((tab, i) => (
                <button
                  role="tab"
                  aria-selected={note === i}
                  aria-controls={`note-panel-${i}`}
                  id={`note-tab-${i}`}
                  tabIndex={note === i ? 0 : -1}
                  key={tab}
                  onClick={() => {
                    setNote(i);
                    setNotesTouched(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      setNotesTouched(true);
                      const next =
                        (note + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                      setNote(next);
                      document.getElementById(`note-tab-${next}`)?.focus();
                    }
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                  <span>{tab}</span>
                </button>
              ))}
            </div>
            <div
              className="note-description"
              role="tabpanel"
              id={`note-panel-${note}`}
              aria-labelledby={`note-tab-${note}`}
              key={note}
            >
              <span className="eyebrow">{notes[note].sub}</span>
              <h3>{notes[note].name}</h3>
              <p>{notes[note].copy}</p>
            </div>
          </div>
        </section>
        <section className="moments" aria-labelledby="moments-title">
          <div className="moments-track">
            <div className="moments-intro">
              <span className="eyebrow">03 / {t.momentsLabel}</span>
              <h2 id="moments-title">
                <Lines text={t.momentsTitle} />
              </h2>
              <p>{t.momentsCopy}</p>
              <div className="moments-arrows">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    className="icon-button"
                    aria-label={dir < 0 ? (lang === "en" ? "Previous" : "Précédent") : lang === "en" ? "Next" : "Suivant"}
                    onClick={() => {
                      const track = document.querySelector<HTMLElement>(".moments-track");
                      const step = window.innerWidth * 0.36 * dir;
                      if (window.innerWidth >= 800 && lenis.current)
                        lenis.current.scrollTo(window.scrollY + step, { duration: 1.1 });
                      else track?.scrollBy({ left: step, behavior: "smooth" });
                    }}
                  >
                    {dir < 0 ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </button>
                ))}
              </div>
            </div>
            {moments.map((m, i) => (
              <figure
                className={`moment moment-${i % 3}`}
                key={m.src}
                data-cursor={t.view}
                onPointerMove={(e) => tilt(e, 8)}
                onPointerLeave={untilt}
              >
                <div className="moment-media">
                  <img {...img(m, "(max-width: 799px) 78vw, 34vw")} loading="lazy" width="1200" height="1600" />
                </div>
                <figcaption>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {m.place[lang]}
                  <small>{t.photoCredit} · {m.credit}</small>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="moments-progress" aria-hidden="true">
            <span />
          </div>
        </section>
        <section className="world" id="story">
          <div className="world-copy">
            <span className="eyebrow">04 / {t.worldLabel}</span>
            <h2>
              <Lines text={t.worldTitle} />
            </h2>
            <p>{t.worldCopy}</p>
            <a
              className="text-link"
              href="#journal"
              onClick={(e) => {
                e.preventDefault();
                go("#journal");
              }}
            >
              {t.worldCta}
              <Plus size={16} />
            </a>
            <span className="world-signature">avec amour, velora</span>
          </div>
          <div className="world-image">
            <img
              {...img(photos.world, "(max-width: 799px) 100vw, 50vw")}
              width="1600"
              height="2400"
              loading="lazy"
            />
            <span className="image-caption">L’ART DES INSTANTS PRÉCIEUX</span>
          </div>
        </section>
        <section className="journal" id="journal">
          <div className="journal-heading">
            <span className="eyebrow">05 / {t.journalLabel}</span>
            <h2>{t.journalTitle}</h2>
          </div>
          <div className="journal-grid">
            {[0, 1].map((i) => (
              <button
                key={i}
                className="journal-card"
                data-cursor={t.read2}
                onClick={() => {
                  setArticle(i);
                  setPanel("journal");
                }}
              >
                <div className={`journal-picture ${i === 1 ? "second" : ""}`}>
                  <img
                    {...img(i === 0 ? photos.journalOne : photos.journalTwo, "(max-width: 799px) 100vw, 50vw")}
                    width="1600"
                    height="2400"
                    loading="lazy"
                  />
                  <span className="journal-circle">
                    <Plus size={24} />
                  </span>
                </div>
                <div className="journal-card-info">
                  <span className="eyebrow">
                    0{i + 1} /{" "}
                    {i === 0
                      ? "Inspiration"
                      : lang === "en"
                        ? "Rituals"
                        : "Rituels"}
                  </span>
                  <h3>{i === 0 ? t.articleOne : t.articleTwo}</h3>
                  <span className="text-link">{t.read}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="closing">
          <img
            className="closing-image"
            {...img(photos.closing)}
            width="2400"
            height="3600"
            loading="lazy"
          />
          <div className="closing-shade" />
          <div className="closing-content">
            <span className="eyebrow">VELORA PARIS</span>
            <h2>
              {t.closing.split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h2>
            <button
              className="pill light"
              onPointerMove={magnet}
              onPointerLeave={unmagnet}
              onClick={() => setPanel("product")}
            >
              {t.closingCta}
              <span className="pill-dot">
                <Plus size={20} />
              </span>
            </button>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <div>
            <Brand />
            <p>{t.footerLine}</p>
          </div>
          <nav aria-label="Footer">
            <button onClick={() => setPanel("product")}>{t.collections}</button>
            <a
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                go("#story");
              }}
            >
              {t.story}
            </a>
            <a
              href="#journal"
              onClick={(e) => {
                e.preventDefault();
                go("#journal");
              }}
            >
              {t.journal}
            </a>
          </nav>
          <div className="footer-service">
            <button
              onClick={() => {
                setArticle(0);
                setPanel("care");
              }}
            >
              {t.care}
            </button>
            <button
              onClick={() => {
                setArticle(1);
                setPanel("care");
              }}
            >
              {t.privacy}
            </button>
            <button onClick={() => go("#top")}>{t.back}</button>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          velora
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VELORA PARIS</span>
          <span>L’ESSENCE DES BEAUX INSTANTS</span>
          <span>EN / FR</span>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className={`modal ${panel === "bag" || panel === "menu" ? "side-modal" : ""}`}
        onClose={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPanel(null);
        }}
        aria-label={
          panel === "bag"
            ? t.bagTitle
            : panel === "search"
              ? t.searchTitle
              : panel === "product"
                ? "Éclat"
                : "VELORA Paris"
        }
      >
        <div className="modal-inner" data-lenis-prevent>
          <button
            className="modal-close icon-button"
            onClick={() => setPanel(null)}
            aria-label={lang === "en" ? "Close" : "Fermer"}
          >
            <X size={24} />
          </button>
          {panel === "search" && (
            <div className="search-panel">
              <span className="eyebrow">VELORA PARIS</span>
              <h2>{t.searchTitle}</h2>
              <div className="search-input">
                <Search size={24} />
                <input
                  autoFocus
                  aria-label={t.searchPlaceholder}
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="search-results">
                {searchItems.length ? (
                  searchItems.map((item) => (
                    <button key={item.title} onClick={item.action}>
                      <img src={item.image} alt="" width="75" height="90" />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.sub}</small>
                      </span>
                      <Plus size={20} />
                    </button>
                  ))
                ) : (
                  <p>{t.searchEmpty}</p>
                )}
              </div>
            </div>
          )}
          {panel === "product" && (
            <div className="product-modal">
              <div
                className="product-modal-picture"
                style={{ background: moods[mood].bg }}
                data-cursor="Zoom"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
                onClick={(e) => e.currentTarget.classList.toggle("is-zoomed")}
                onPointerLeave={(e) => e.currentTarget.classList.remove("is-zoomed")}
              >
                <span className="product-modal-word">Éclat</span>
                <img
                  src={assets.bottle}
                  srcSet={bottleSrcSet}
                  sizes="(max-width: 799px) 90vw, 45vw"
                  alt="VELORA Éclat eau de parfum"
                  width="1086"
                  height="1448"
                />
                <div className="modal-moods" onClick={(e) => e.stopPropagation()}>
                  {moods.map((m, i) => (
                    <button
                      key={m.key}
                      aria-label={t.moods[i]}
                      aria-pressed={mood === i}
                      className={mood === i ? "is-active" : ""}
                      style={{ background: m.bg }}
                      onClick={() => setMood(i)}
                    />
                  ))}
                </div>
              </div>
              <div className="product-modal-copy">
                <span className="eyebrow">{t.signature}</span>
                <h2>Éclat</h2>
                <p className="product-scent">{t.scent}</p>
                <p>{t.bottleCopy}</p>
                <div className="size-option">
                  <Check size={16} />
                  <span>{t.size}</span>
                </div>
                <button className="pill solid" onClick={add}>
                  {t.add}
                  <ShoppingBag size={18} />
                </button>
                <p className="ordering-note">{t.purchaseInfo}</p>
                <div className="product-notes">
                  <span>01 — {t.peach}</span>
                  <span>02 — {t.jasmine}</span>
                  <span>03 — {t.wood}</span>
                </div>
              </div>
            </div>
          )}
          {panel === "bag" && (
            <div className="bag-panel">
              <span className="eyebrow">VELORA PARIS</span>
              <h2>
                {t.bagTitle} <sup>({bag})</sup>
              </h2>
              {bag ? (
                <>
                  <div className="bag-item">
                    <div className="bag-image">
                      <img
                        src={assets.bottle}
                        alt="Éclat"
                        width="180"
                        height="240"
                      />
                    </div>
                    <div>
                      <h3>Éclat</h3>
                      <p>
                        {t.eau}
                        <br />
                        100 ml
                      </p>
                      <div className="quantity">
                        <button
                          aria-label={
                            lang === "en"
                              ? "Decrease quantity"
                              : "Réduire la quantité"
                          }
                          onClick={() => updateBag(bag - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <output>{bag}</output>
                        <button
                          disabled={bag >= 20}
                          aria-label={
                            lang === "en"
                              ? "Increase quantity"
                              : "Augmenter la quantité"
                          }
                          onClick={() => updateBag(bag + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button className="remove" onClick={() => updateBag(0)}>
                        {t.remove}
                      </button>
                    </div>
                  </div>
                  <p className="bag-information">{t.purchaseInfo}</p>
                  <button className="pill solid" onClick={saveBag}>
                    {t.save}
                    <Check size={18} />
                  </button>
                </>
              ) : (
                <div className="empty-bag">
                  <ShoppingBag size={32} />
                  <h3>{t.bagEmpty}</h3>
                  <p>{t.bagEmptyCopy}</p>
                  <button
                    className="pill dark"
                    onClick={() => setPanel("product")}
                  >
                    {t.discover}
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
          {panel === "menu" && (
            <div className="mobile-panel">
              <Brand />
              <nav>
                <button onClick={() => go("#collection")}>
                  {t.collections}
                </button>
                <button onClick={() => setPanel("product")}>{t.shop}</button>
                <button onClick={() => go("#story")}>{t.story}</button>
                <button onClick={() => go("#journal")}>{t.journal}</button>
              </nav>
              <button className="text-link" onClick={() => setPanel("search")}>
                <Search size={17} />
                {t.searchTitle}
              </button>
              <label className="mobile-language">
                {t.language}
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </label>
            </div>
          )}
          {panel === "journal" && (
            <article className="article-panel">
              <img
                {...img(article === 0 ? photos.journalOne : photos.journalTwo, "(max-width: 799px) 100vw, 900px")}
                width="1600"
                height="2400"
              />
              <span className="eyebrow">{t.journalLabel}</span>
              <h2>{article === 0 ? t.articleOne : t.articleTwo}</h2>
              {(lang === "en"
                ? article === 0
                  ? [
                      "There is a moment just before the sun slips away when the world seems to soften. Stone turns honey-coloured. The air is warm, and everything feels a little closer.",
                      "This is the feeling at the heart of Éclat: the luminous sweetness of peach, the quiet beauty of jasmine, the familiar warmth of soft woods. A composition inspired by the light we wish we could keep.",
                      "Some moments pass. Others become part of us.",
                    ]
                  : [
                      "A fragrance is a personal ritual. A pause before the day begins, a small finishing touch before an evening out, or simply something beautiful for yourself.",
                      "Let Éclat settle naturally on the skin. Notice the bright opening, the floral heart, and the soft warmth that follows. Each part of the composition has its own moment.",
                      "Wear it for the occasion. Or let it be the occasion.",
                    ]
                : article === 0
                  ? [
                      "Juste avant que le soleil disparaisse, le monde semble s’adoucir. La pierre devient couleur de miel. L’air est chaud et tout paraît plus proche.",
                      "C’est l’émotion au cœur d’Éclat : la douceur lumineuse de la pêche, la beauté discrète du jasmin, la chaleur familière des bois doux.",
                      "Certains instants passent. D’autres deviennent une part de nous.",
                    ]
                  : [
                      "Le parfum est un rituel personnel. Une pause avant de commencer la journée, une touche avant de sortir, ou simplement un plaisir pour soi.",
                      "Laissez Éclat se poser naturellement sur la peau. Découvrez son envolée lumineuse, son cœur floral et la chaleur douce qui suit.",
                      "Portez-le pour une occasion. Ou faites-en l’occasion.",
                    ]
              ).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <button className="text-link" onClick={() => setPanel("product")}>
                {t.discover}
                <Plus size={16} />
              </button>
            </article>
          )}
          {panel === "care" && (
            <div className="care-panel">
              <span className="eyebrow">VELORA PARIS</span>
              <h2>{article === 0 ? t.care : t.privacy}</h2>
              <p>
                {article === 0
                  ? lang === "en"
                    ? "Keep your fragrance away from direct sunlight and heat. Store the bottle upright with the cap in place, in a cool, dry setting. Let the fragrance dry naturally on the skin."
                    : "Gardez votre parfum à l’abri du soleil et de la chaleur. Rangez le flacon debout et fermé dans un endroit frais et sec. Laissez le parfum sécher naturellement sur la peau."
                  : lang === "en"
                    ? "Your fragrance selection and language preference are saved only in this browser. Search is performed on this page. No payment, order or account is created. Clearing your browser’s site data removes your saved selection."
                    : "Votre sélection et votre langue sont enregistrées uniquement dans ce navigateur. La recherche s’effectue sur cette page. Aucun paiement, commande ou compte n’est créé. Effacer les données du site supprime votre sélection."}
              </p>
              {article === 1 && (
                <button
                  className="pill dark"
                  onClick={() => {
                    updateBag(0);
                    setToast(
                      lang === "en"
                        ? "Your selection has been cleared."
                        : "Votre sélection a été effacée.",
                    );
                  }}
                >
                  {lang === "en"
                    ? "Clear my selection"
                    : "Effacer ma sélection"}
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </dialog>
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <Check size={16} />
        {toast}
      </div>
    </div>
  );
}
