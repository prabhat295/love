import { useState, useEffect } from 'react';
import PasswordGate from './components/PasswordGate';
import WelcomePopup from './components/WelcomePopup';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoveMessage from './components/LoveMessage';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import Reasons from './components/Reasons';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MusicPlayer from './components/MusicPlayer';
import SoundtrackZone from './components/SoundtrackZone';
import { gallery, galleryEngagement } from './content';
import { isUnlocked, unlock, watch } from './session';
import { prefetchAll } from './backgroundMusic';

export default function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [showNote, setShowNote] = useState(false);

  const handleUnlock = () => {
    unlock();
    setUnlocked(true);
    /* Start downloading both songs now. The larger one is 13 MB, and without
       this head start it spends the first few seconds of the slideshow
       buffering — by which point she's already on the third photo. */
    prefetchAll();
  };

  /* Covers a refresh mid-session, where handleUnlock never runs */
  useEffect(() => {
    if (unlocked) prefetchAll();
  }, [unlocked]);

  /* Send her back to the password screen once the session times out. */
  useEffect(() => {
    if (!unlocked) return;

    return watch(() => {
      setUnlocked(false);
      setShowNote(false);
      /* Back to the top, so re-entering the password doesn't drop her
         halfway down a page she's supposed to be locked out of. */
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [unlocked]);

  if (!unlocked) {
    return (
      <>
        <MusicPlayer />
        <PasswordGate onUnlock={handleUnlock} />
      </>
    );
  }

  return (
    <>
      <MusicPlayer />
      <main className="w-full overflow-x-hidden">
        <Navbar />

        {/* "Dil Kholiye" opens the note — it does not scroll */}
        <Hero onOpenNote={() => setShowNote(true)} />

        <LoveMessage />

        {/* Each gallery starts its own song when she opens a photo. It has to
            happen on the click — browsers won't start audio any other way. */}
        <Gallery
          id="gallery"
          copy={gallery}
          filter={(p) => p.group === 'us'}
          songKey="us"
          background="linear-gradient(180deg, #002235 0%, #001830 50%, #002235 100%)"
        />

        <Gallery
          id="engagement"
          copy={galleryEngagement}
          filter={(p) => p.group !== 'us'}
          songKey="engagement"
          background="linear-gradient(180deg, #002235 0%, #002a42 45%, #002235 100%)"
        />

        {/* Silences whatever is playing while the video is on screen, then
            puts it back — the video has its own audio. */}
        <SoundtrackZone songKey="video">
          <VideoSection />
        </SoundtrackZone>

        <Reasons />
        <Timeline />
        <Footer />
        <ScrollToTop />

        {showNote && <WelcomePopup onClose={() => setShowNote(false)} />}
      </main>
    </>
  );
}
