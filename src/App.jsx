import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const photos = Array.from({length:8}, (_,i)=>`/media/memory-${String(i+1).padStart(2,'0')}.jpg`)
const videos = [
  {src:'/media/video-01.mp4', poster:'/media/posters/video-01.jpg', label:'A little moment worth replaying', duration:'27 sec'},
  {src:'/media/video-02.mp4', poster:'/media/posters/video-02.jpg', label:'Some memories just feel warm', duration:'17 sec'},
  {src:'/media/video-03.mp4', poster:'/media/posters/video-03.jpg', label:'Because one watch is never enough', duration:'18 sec'}
]

function Rakhi3D({big=false}){
  const group=useRef()
  useFrame((state,delta)=>{ if(group.current){ group.current.rotation.z += delta*0.12; group.current.rotation.y = Math.sin(state.clock.elapsedTime*.55)*.12 }})
  return <group ref={group} scale={big?1.45:1}>
    <mesh rotation={[0,0,Math.PI/2]}>
      <torusGeometry args={[1.05,.07,16,64]} />
      <meshStandardMaterial color="#f4a5c8" metalness={.45} roughness={.28} emissive="#6e294e" emissiveIntensity={.22}/>
    </mesh>
    <mesh>
      <torusGeometry args={[.55,.16,18,64]} />
      <meshStandardMaterial color="#f7d58b" metalness={.75} roughness={.2}/>
    </mesh>
    <mesh rotation={[0,0,Math.PI/4]}>
      <torusGeometry args={[.32,.11,18,48]} />
      <meshStandardMaterial color="#b98be8" metalness={.45} roughness={.22} emissive="#6b3e96" emissiveIntensity={.25}/>
    </mesh>
    <mesh position={[0,0,.08]}>
      <sphereGeometry args={[.18,24,24]} />
      <meshStandardMaterial color="#ffe9a8" emissive="#ffc85a" emissiveIntensity={.8} metalness={.25} roughness={.18}/>
    </mesh>
    {[0,1,2,3].map(i=><mesh key={i} rotation={[0,0,i*Math.PI/2]} position={[Math.cos(i*Math.PI/2)*.82,Math.sin(i*Math.PI/2)*.82,.02]}>
      <sphereGeometry args={[.11,16,16]} />
      <meshStandardMaterial color="#ffd0e5" emissive="#ff8fc3" emissiveIntensity={.35}/>
    </mesh>)}
  </group>
}

function Scene({big=false, controls=false}){
  return <div className="scene3d">
    <Canvas camera={{position:[0,0,4.3],fov:40}} dpr={[1,1.5]}>
      <ambientLight intensity={1.25}/><pointLight position={[2,3,4]} intensity={18} distance={8} color="#ffd8e9"/><pointLight position={[-3,-2,2]} intensity={8} color="#bda8ff"/>
      <Float speed={1.1} rotationIntensity={.18} floatIntensity={.65}><Rakhi3D big={big}/></Float>
      <Sparkles count={big?120:70} scale={[5,5,3]} size={2} speed={.35} color="#ffd6e7" />
      {controls && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.7}/>} 
    </Canvas>
  </div>
}

function Particles(){ return <div className="particle-field" aria-hidden="true">{Array.from({length:26},(_,i)=><span key={i} style={{'--i':i,left:`${(i*37)%100}%`,top:`${(i*61)%100}%`}} />)}</div> }

function MusicControl(){
  const audio=useRef(null); const [on,setOn]=useState(false)
  useEffect(()=>{ audio.current=new Audio('/music.mp3'); audio.current.loop=true; audio.current.volume=.34; return ()=>audio.current?.pause() },[])
  const toggle=async()=>{ if(!audio.current)return; if(on){audio.current.pause();setOn(false)} else {try{await audio.current.play();setOn(true)}catch{alert('Add your MP3 as public/music.mp3, then tap the music button again.')}} }
  return <button className="music-btn" onClick={toggle} title="Music">{on?'🔊':'♪'}</button>
}

function Layout({children}){
 const location=useLocation(); const [menu,setMenu]=useState(false)
 const nav=[['/','Home'],['/raksha-bandhan','Raksha Bandhan'],['/memories','Memories'],['/her-world','Her World'],['/videos','Videos'],['/letter','Letter'],['/final-surprise','Final Surprise']]
 return <div className="app-shell"><Particles/><MusicControl/>
   <header className="nav"><Link className="brand" to="/">A<span>♥</span></Link><button className="menu-btn" onClick={()=>setMenu(!menu)}>☰</button>
    <nav className={menu?'nav-links open':'nav-links'}>{nav.map(([to,label])=><Link key={to} className={location.pathname===to?'active':''} onClick={()=>setMenu(false)} to={to}>{label}</Link>)}</nav>
   </header>
   <AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-18}} transition={{duration:.45,ease:'easeOut'}}>{children}</motion.main></AnimatePresence>
 </div>
}

function Home(){const nav=useNavigate(); return <section className="hero-page">
 <div className="hero-copy"><p className="eyebrow">A tiny digital gift • made with love</p><h1>Something special,<br/><em>for someone special...</em></h1><div className="name">Anjali <span>♥</span></div><p className="hero-sub">A little journey through memories, madness, laughter and the bond only siblings understand.</p><button className="primary" onClick={()=>nav('/raksha-bandhan')}>Open Your Surprise <span>✨</span></button></div>
 <Scene big/><div className="scroll-note">scroll gently <span>↓</span></div>
 </section>}

function Bandhan(){const nav=useNavigate(); return <section className="page bandhan"><div className="split-copy"><p className="eyebrow">A thread that means more than it looks</p><h2>Happy Raksha Bandhan,<br/><em>Anjali ❤️</em></h2><p>Ek chhoti si website, ek bahut special insaan ke liye. Life kitni bhi busy ho jaaye, sibling bond ki apni hi language hoti hai — thodi nok-jhok, thodi hasi, aur bahut saara apnapan.</p><p>So this isn't just a wish. It's a tiny place where some of the moments that make you <strong>you</strong> get to live again.</p><button className="secondary" onClick={()=>nav('/memories')}>Let's Go Through Our Memories →</button></div><Scene big controls/></section>}

function Memories(){const [open,setOpen]=useState(null); return <section className="page memories"><div className="page-heading"><p className="eyebrow">Chapter 01</p><h2>Little Moments,<br/><em>Big Memories ❤️</em></h2><p>Some memories don't need words.</p></div><div className="memory-grid">{photos.map((src,i)=><motion.button key={src} className={`polaroid p${i+1}`} whileHover={{scale:1.04,rotate:0,zIndex:5}} onClick={()=>setOpen(src)}><img src={src} alt={`Anjali memory ${i+1}`} loading="lazy"/><span>memory {String(i+1).padStart(2,'0')}</span></motion.button>)}</div>{open&&<div className="lightbox" onClick={()=>setOpen(null)}><img src={open} alt="Expanded memory"/><button onClick={()=>setOpen(null)}>×</button></div>}</section>}

function HerWorld(){return <section className="page her-world"><div className="world-hero"><p className="eyebrow">Chapter 02</p><h2>Her little world.<br/><em>My favorite chaos.</em></h2><p>Some things are better said with a smile.</p></div><div className="orbit-wrap"><div className="orbit-center"><img src={photos[4]} alt="Anjali" loading="lazy"/></div>{['Beautiful memories','Endless laughs','Random fights','Unforgettable moments','My annoying but favorite sister ❤️','Always somehow iconic'].map((t,i)=><motion.div key={t} className={`float-card c${i+1}`} animate={{y:[0,-8,0],rotate:[-2,2,-2]}} transition={{duration:4+i*.35,repeat:Infinity,ease:'easeInOut'}}>{t}</motion.div>)}</div></section>}

function Videos(){const [active,setActive]=useState(null); return <section className="page videos"><div className="page-heading"><p className="eyebrow">Chapter 03</p><h2>Memories, But<br/><em>In Motion 🎬</em></h2><p>Because some moments deserve to be watched again.</p></div><div className="video-grid">{videos.map((v,i)=><motion.article key={v.src} className="video-card" whileHover={{y:-8}}><div className="video-thumb"><img src={v.poster} alt="Video poster" loading="lazy"/><button onClick={()=>setActive(v.src)}>▶</button><span>{v.duration}</span></div><div><p>{v.label}</p><small>video memory {i+1}</small></div></motion.article>)}</div>{active&&<div className="video-modal" onClick={()=>setActive(null)}><div className="video-box" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setActive(null)}>×</button><video src={active} controls autoPlay playsInline/></div></div>}</section>}

function Letter(){return <section className="page letter"><div className="paper"><p className="eyebrow">Chapter 04</p><h2>For You, Anjali...</h2><div className="letter-text"><p>Dear Anjali,</p><p>Honestly, siblings have a strange way of showing love. Kabhi ek dusre ko annoy karna, kabhi silly si baat pe ladna, aur phir thodi der baad aise behave karna jaise kuch hua hi nahi. 😭❤️</p><p>We've grown, changed, laughed, argued and made a whole collection of little moments along the way. Har memory perfect ho, zaroori nahi — but somehow, having a sister like you makes the ordinary moments feel special.</p><p>Thank you for being the person I can annoy endlessly, laugh with randomly, and still know will always be family no matter what.</p><p>Bas itna hi — life jahan bhi le jaaye, apna ye weird sa sibling bond kabhi boring mat hone dena.</p><p className="sign">Your brother,<br/><strong>Hamesha ❤️</strong></p></div></div></section>}

function Final(){const [celebrate,setCelebrate]=useState(false); return <section className="final-page"><div className="final-copy"><p className="eyebrow">The last chapter</p><h2>Whatever happens,<br/><em>wherever life takes us...</em></h2><p>You'll always be my sister, and I'll always be your brother. ❤️</p><h3>Happy Raksha Bandhan, Anjali.</h3><button className="primary" onClick={()=>setCelebrate(true)}>One Last Thing ✨</button></div><Scene big/>{celebrate&&<div className="celebration" onClick={()=>setCelebrate(false)}>{Array.from({length:75},(_,i)=><i key={i} style={{'--i':i}}>{i%3===0?'♥':i%3===1?'✦':'✿'}</i>)}<div className="celebrate-msg">You are loved. <span>Always. ❤️</span></div></div>}</section>}

export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/raksha-bandhan" element={<Bandhan/>}/><Route path="/memories" element={<Memories/>}/><Route path="/her-world" element={<HerWorld/>}/><Route path="/videos" element={<Videos/>}/><Route path="/letter" element={<Letter/>}/><Route path="/final-surprise" element={<Final/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout>}
