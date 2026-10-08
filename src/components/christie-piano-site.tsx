"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiInstagram, FiMenu, FiPause, FiPlay, FiX, FiYoutube } from "react-icons/fi";
import { FaApple, FaSpotify } from "react-icons/fa";

const spotify = "https://open.spotify.com/album/7odkqThKgoum5Uo6Jk0R0F";
const appleMusic = "https://music.apple.com/us/artist/christie-kanska/1451556186";
const youtube = "https://www.youtube.com/@Christie119";
const email = "zckmusicproduction1@gmail.com";
const tracks = ["Le Rêve", "Bananeira", "Dindi", "Triste", "Fotografia"];
const studioServices = ["Composition", "Arrangement", "Recording", "Production"];

function Arrow() { return <FiArrowRight aria-hidden="true" />; }

const noteNames = ["C", "D", "E", "F", "G", "A", "B"];

function playPianoTone(index: number, black = false) {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const base = 130.81;
  oscillator.type = "triangle";
  oscillator.frequency.value = base * Math.pow(2, (index + (black ? .5 : 0)) / 12);
  gain.gain.setValueAtTime(.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.18, context.currentTime + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .7);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + .72);
  oscillator.addEventListener("ended", () => void context.close());
}

function ExperienceLayer() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduced) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = event.clientX / window.innerWidth - .5;
        const ny = event.clientY / window.innerHeight - .5;
        root.style.setProperty("--pointer-x", nx.toFixed(3));
        root.style.setProperty("--pointer-y", ny.toFixed(3));
        if (cursorRef.current && finePointer) cursorRef.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      });
    };
    const scroll = () => {
      const depth = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-depth", `${depth}px`);
      root.style.setProperty("--scroll-progress", `${depth / max}`);
    };
    const tiltItems = [...document.querySelectorAll<HTMLElement>("[data-tilt]")];
    const cleanups: Array<() => void> = [];
    tiltItems.forEach((item) => {
      const tilt = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--tilt-x", `${((event.clientY - rect.top) / rect.height - .5) * -9}deg`);
        item.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 10}deg`);
      };
      const reset = () => { item.style.setProperty("--tilt-x", "0deg"); item.style.setProperty("--tilt-y", "0deg"); };
      item.addEventListener("pointermove", tilt);
      item.addEventListener("pointerleave", reset);
      cleanups.push(() => { item.removeEventListener("pointermove", tilt); item.removeEventListener("pointerleave", reset); });
    });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="experience-layer" aria-hidden="true">
      <div className="cursor-orbit" ref={cursorRef}><i /></div>
      <div className="ambient-notes">{["♪", "♩", "♫", "♬", "♪", "♩"].map((note, i) => <span key={i} style={{ "--note": i } as React.CSSProperties}>{note}</span>)}</div>
      <div className="scroll-beam" />
    </div>
  );
}

function PianoLines({ light = true }: { light?: boolean }) {
  return (
    <svg className="piano-lines" viewBox="0 0 760 520" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke={light ? "white" : "black"}>
        <path className="piano-rim" d="M50 0V520H735v-18H130C360 395 275 250 200 128 156 55 100 54 50 50" />
        {Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M${70 + i * 20} 0 V520 L${155 + i * 43} 502`} opacity={0.7 - i * 0.025} />)}
      </g>
    </svg>
  );
}

function WaveArt({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="wave-art" data-tilt viewBox="0 0 600 440" role="img" aria-label="Abstract musical wave artwork">
      <rect width="600" height="440" fill={dark ? "#111" : "#f7f7f5"} />
      {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M-20 ${380 - i * 7} C 120 ${130 + i * 4}, 260 ${380 - i * 11}, 620 ${55 + i * 9}`} fill="none" stroke={dark ? "#fff" : "#111"} strokeWidth="1.6" opacity={0.98 - i * 0.02} />)}
    </svg>
  );
}

function BirdMark() {
  return (
    <svg className="bird-mark" data-float viewBox="0 0 300 360" role="img" aria-label="Song bird line drawing">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M64 178c45-49 126-52 170-5-33-5-52 9-66 34-18 31-42 53-78 46-34-7-51-39-26-75Z" />
        <path d="M91 194c38-9 76 2 100 37M99 206c31 3 53 17 71 36M222 176l39 12-36 11" />
        <circle cx="206" cy="174" r="3" fill="currentColor" />
        <path d="M111 252c20 20 22 45 14 79M134 252c30 21 44 49 48 89M153 240c38 29 59 56 74 95M90 254 72 285M109 258l-5 31" />
      </g>
    </svg>
  );
}

function BookArt() {
  return (
    <svg className="book-art" data-tilt viewBox="0 0 760 360" role="img" aria-label="Open story book with musical notes">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 270Q185 216 368 304Q565 210 720 270Q551 281 371 334Q190 280 40 270Z" />
        <path d="M40 270Q194 192 368 304M720 270Q548 185 368 304M72 252Q204 199 350 288M691 252Q555 195 389 288" />
        <path d="M356 188Q450 112 640 100M356 206Q460 132 640 124M356 224Q470 151 640 149" />
        {[430, 500, 575, 630].map((x, i) => <g key={x}><circle cx={x} cy={168 - i * 18} r="8" fill="currentColor" /><path d={`M${x + 8} ${168 - i * 18}v-54`} /></g>)}
      </g>
    </svg>
  );
}

function PianoNav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const nav = [["Music", "#music"], ["Story", "#story"], ["Live", "#live"], ["Contact", "#contact"]];
  const [pressed, setPressed] = useState("");
  const press = (index: number, black = false) => {
    const key = `${black ? "b" : "w"}${index}`;
    setPressed(key);
    playPianoTone(index, black);
    window.setTimeout(() => setPressed(""), 170);
  };
  return (
    <header className="piano-nav">
      <div className="white-keys">{Array.from({ length: 24 }).map((_, i) => <button type="button" className={pressed === `w${i}` ? "pressed" : ""} aria-label={`Play ${noteNames[i % 7]} piano note`} onPointerDown={() => press(i)} key={i} />)}</div>
      <div className="black-keys">{Array.from({ length: 17 }).map((_, i) => <button type="button" className={pressed === `b${i}` ? "pressed" : ""} aria-label="Play sharp piano note" onPointerDown={() => press(i, true)} key={i} />)}</div>
      <nav aria-label="Primary navigation">
        {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="full-menu"><span>Menu</span>{menuOpen ? <FiX /> : <FiMenu />}</button>
      </nav>
    </header>
  );
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={`reveal-3d ${className}`} initial={{ opacity: 0, y: 55, rotateX: 9, scale: .97, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export default function ChristiePianoSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website enquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get("from")})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PianoNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <ExperienceLayer />
      <aside id="full-menu" className={`full-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <PianoLines /><button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><FiX /></button>
        <div className="menu-brand"><strong>CHRISTIE<br />KANSKA</strong><span>VOICE / PIANO / COMPOSITION</span></div>
        <nav>{[["Music", "#music"], ["Story", "#story"], ["Live", "#live"], ["Education", "#education"], ["Song Bird", "#song-bird"], ["ZCK Studio", "#studio"], ["Shop", "#shop"], ["Contact", "#contact"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}</nav>
      </aside>

      <main>
        <section className="hero black-section" id="top">
          <PianoLines />
          <div className="hero-copy"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }}>A LIFE IN MUSIC</motion.p><motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>CHRISTIE<br />KANSKA</motion.h1><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}>VOICE &nbsp; / &nbsp; PIANO &nbsp; / &nbsp; COMPOSITION</motion.span><motion.a className="outline-button" href={spotify} target="_blank" rel="noreferrer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}>LISTEN NOW <Arrow /></motion.a></div>
        </section>

        <section className="music-section" id="music">
          <div className="section-heading"><h2>MUSIC</h2><span>PIANO &nbsp; / &nbsp; VOICE &nbsp; / &nbsp; COMPOSITION</span></div>
          <SectionReveal className="album-grid">
            <WaveArt /><div className="album-copy"><h3>LE RÊVE</h3><p>A collection of original compositions for piano and voice — intimate, cinematic and deeply human.</p><div className="player-row"><button type="button" className="round-play" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause preview" : "Play preview"}>{playing ? <FiPause /> : <FiPlay />}</button><div className="progress"><i className={playing ? "playing" : ""} /></div></div><div className="platforms"><a href={spotify} target="_blank" rel="noreferrer"><FaSpotify /> LISTEN ON SPOTIFY</a><a href={appleMusic} target="_blank" rel="noreferrer"><FaApple /> LISTEN ON APPLE MUSIC</a></div></div>
            <ol className="track-list">{tracks.map((track, i) => <li key={track} className={activeTrack === i ? "active" : ""}><button type="button" onClick={() => { setActiveTrack(i); setPlaying(true); }}><span>0{i + 1}</span><strong>{track}</strong><i>{activeTrack === i && playing ? <FiPause /> : <FiPlay />}</i></button></li>)}</ol>
          </SectionReveal>
        </section>

        <section className="story black-section" id="story">
          <Image src="/christie-hero.jpg" alt="Christie Kanska playing piano" fill sizes="100vw" /><div className="story-shade" /><PianoLines />
          <SectionReveal className="story-copy"><h2>A LIFE<br />IN MUSIC</h2><p>VOCALIST, PIANIST, COMPOSER<br />AND MUSIC EDUCATOR.</p><a className="outline-button" href="#about">READ HER STORY <Arrow /></a></SectionReveal>
          <div className="story-path"><i /><span>YEREVAN</span><i /><span>THESSALONIKI</span><i /><span>BOSTON</span><i /><span>NEW YORK</span></div>
        </section>

        <section className="about-section" id="about"><SectionReveal><span className="eyebrow">HER STORY</span><h2>Rooted in many places.<br /><em>At home in music.</em></h2><p>Born in Yerevan, Christie began playing piano at seven. Her musical path moved through Thessaloniki, Boston and New York — gathering languages, rhythms and ways of listening. A Berklee College of Music graduate, her practice now crosses performance, composition, production and education.</p></SectionReveal><Image data-tilt src="/christie-live.jpg" alt="Portrait of Christie Kanska" width={748} height={562} /></section>

        <section className="live-section" id="live"><SectionReveal className="live-copy"><h2>ON STAGE</h2><p>MUSIC LIVES IN THE SPACES<br />BETWEEN US.</p><i /><span>DATES TO BE ANNOUNCED</span><a className="outline-button dark" href={`mailto:${email}?subject=Performance%20Updates`}>RECEIVE UPDATES <Arrow /></a></SectionReveal><a className="live-image" data-tilt href={youtube} target="_blank" rel="noreferrer"><Image src="/performance-video.jpg" alt="Christie Kanska performing on stage" fill sizes="(max-width: 800px) 100vw, 58vw" /><span><i><FiPlay /></i> WATCH PERFORMANCE</span></a></section>

        <section className="education black-section" id="education"><PianoLines /><SectionReveal className="education-copy"><span className="eyebrow">EDUCATION</span><h2>FIND YOUR<br />VOICE</h2><p className="caps">PIANO &nbsp; / &nbsp; VOICE &nbsp; / &nbsp; CHOIR</p><p>Lessons shaped around the musician<br />you want to become.</p><a className="outline-button" href={`mailto:${email}?subject=Lesson%20Enquiry`}>ENQUIRE ABOUT LESSONS <Arrow /></a></SectionReveal><Image data-tilt src="/christie-choir.jpg" alt="Christie teaching young musicians" width={1000} height={899} /></section>

        <section className="studio-section" id="studio"><SectionReveal className="studio-intro"><span className="eyebrow">ZCK STUDIO</span><h2>FROM IDEA<br />TO RECORDING</h2><Image data-tilt src="/performance-video.jpg" alt="Recording studio microphone" width={748} height={562} /></SectionReveal><div className="studio-list">{studioServices.map((service, i) => <div className="service-row" key={service}><span>0{i + 1}</span><strong>{service}</strong></div>)}<a className="outline-button dark" href={`mailto:${email}?subject=Studio%20Enquiry`}>STUDIO ENQUIRY <Arrow /></a></div></section>

        <section className="songbird black-section" id="song-bird"><PianoLines /><SectionReveal className="songbird-copy"><h2>SONG BIRD</h2><span>CREATED BY CHRISTIE KANSKA</span><div><i>MINDFULNESS</i><i>KINDNESS</i><i>IMAGINATION</i><i>NATURE</i></div><a className="outline-button" href="#stories">EXPLORE SONG BIRD <Arrow /></a></SectionReveal><BirdMark /></section>

        <section className="stories-section" id="stories"><SectionReveal className="stories-copy"><h2>STORIES<br />THAT SING</h2><span>IN DEVELOPMENT</span><i /><p>A book and a musical by Christie Kanska exploring how music and imagination can open more compassionate, connected worlds.</p><div><a className="outline-button dark" href={`mailto:${email}?subject=The%20Book`}>THE BOOK <Arrow /></a><a className="outline-button dark" href={`mailto:${email}?subject=The%20Musical`}>THE MUSICAL <Arrow /></a></div></SectionReveal><BookArt /></section>

        <section className="shop black-section" id="shop"><SectionReveal className="shop-copy"><h2>TAKE<br />THE MUSIC<br />HOME</h2><span>MUSIC &nbsp; / &nbsp; DIGITAL RELEASES &nbsp; / &nbsp; CREATIVE PROJECTS</span><a className="outline-button" href={spotify} target="_blank" rel="noreferrer">VIEW MUSIC <Arrow /></a></SectionReveal><div className="shop-grid"><article data-tilt><WaveArt dark /><span>MUSIC</span></article><article data-tilt><Image src="/le-reve-cover.jpg" alt="Le Rêve digital release" width={1060} height={980} /><span>DIGITAL RELEASES</span></article><article data-tilt><Image src="/christie-hero.jpg" alt="Creative piano projects" width={1280} height={800} /><span>CREATIVE PROJECTS</span></article></div></section>

        <section className="newsletter"><Image data-tilt src="/christie-hero.jpg" alt="Piano in window light" width={1280} height={800} /><div><h2>STAY IN TOUCH</h2><p>Be the first to hear about new music, releases and upcoming events.</p>{subscribed ? <strong className="thank-you">THANK YOU — YOU&apos;RE ON THE LIST.</strong> : <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="EMAIL ADDRESS" required /><button type="submit">SUBSCRIBE <Arrow /></button></form>}</div></section>

        <section className="contact-section" id="contact"><div><h2>LET&apos;S<br />MAKE MUSIC</h2><span>PERFORMANCES &nbsp; / &nbsp; LESSONS &nbsp; / &nbsp; COLLABORATIONS</span></div><form onSubmit={submitContact}><label><span>YOUR NAME</span><input name="name" required /></label><label><span>EMAIL</span><input name="from" type="email" required /></label><label className="message"><span>YOUR MESSAGE</span><textarea name="message" required /></label><button type="submit">SEND ENQUIRY <Arrow /></button></form></section>
      </main>

      <footer><div><strong>CHRISTIE KANSKA</strong><span>© 2026</span></div><nav><a href={spotify} target="_blank" rel="noreferrer"><FaSpotify /> SPOTIFY</a><a href={appleMusic} target="_blank" rel="noreferrer"><FaApple /> APPLE MUSIC</a><a href={youtube} target="_blank" rel="noreferrer"><FiYoutube /> YOUTUBE</a><a href="https://instagram.com" target="_blank" rel="noreferrer"><FiInstagram /> INSTAGRAM</a></nav><a href="#top">BACK TO TOP <Arrow /></a></footer>
    </>
  );
}
