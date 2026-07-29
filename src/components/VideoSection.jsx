import { useState } from 'react';
import { useSectionReveal } from '../hooks/useGSAPAnimations';
import SectionHeader from './SectionHeader';
import EmptySlot from './EmptySlot';
import { videos, videoSection } from '../content';
import { publicUrl } from '../publicUrl';

/* Everything sits in a 16:9 box so the layout doesn't jump around while the
   player loads — iframes report no natural size, unlike <video>. */
function Frame({ children }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: '16 / 9',
        border: '1px solid rgba(251,82,72,0.3)',
        boxShadow: '0 0 60px rgba(193,18,31,0.2), 0 24px 70px rgba(0,0,0,0.6)',
        background: '#000',
      }}
    >
      {children}
    </div>
  );
}

/* Note: the background song is silenced for this whole section by the
   <SoundtrackZone songKey="video"> wrapper in App.jsx, not from in here.
   That works for iframes too, which give us no play/pause events at all. */

function Player({ video, onMissing }) {
  /* YouTube — best playback. Checked first so filling in youtubeId
     automatically takes over from the Drive embed. */
  if (video.youtubeId) {
    return (
      <Frame>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </Frame>
    );
  }

  /* Google Drive. Drive refuses to serve video bytes to a <video> tag —
     it only ever returns a thumbnail image — so an iframe is the only way
     to play a Drive-hosted video without downloading it first. */
  if (video.driveId) {
    return (
      <Frame>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://drive.google.com/file/d/${video.driveId}/preview`}
          title={video.title}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </Frame>
    );
  }

  /* A real file in public/videos/ — the nicest player of the three. */
  if (video.file) {
    return (
      <Frame>
        {/* src goes on <video> directly, not a <source> child — a missing file
            only fires `error` on <source>, which doesn't bubble, so the
            placeholder would never show. */}
        <video
          className="absolute inset-0 w-full h-full"
          src={publicUrl(`videos/${video.file}`)}
          controls
          playsInline
          preload="metadata"
          poster={video.poster ? publicUrl(`videos/${video.poster}`) : undefined}
          onError={onMissing}
        />
      </Frame>
    );
  }

  return null;
}

function VideoCard({ video }) {
  const [missing, setMissing] = useState(false);
  const hasSource = video.youtubeId || video.driveId || video.file;

  if (!hasSource || missing) {
    return (
      <EmptySlot
        icon="🎬"
        title={videoSection.emptyTitle}
        hint={video.file ? `public/videos/${video.file}` : videoSection.emptyHint}
      />
    );
  }

  return (
    <figure data-animate className="m-0">
      <Player video={video} onMissing={() => setMissing(true)} />

      <figcaption className="text-center mt-5">
        <h3
          className="text-2xl md:text-3xl font-semibold text-gradient inline-block"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {video.title}
        </h3>
        <p className="text-white/50 mt-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          {video.caption}
        </p>
      </figcaption>
    </figure>
  );
}

export default function VideoSection() {
  const sectionRef = useSectionReveal(0.12, 40);

  return (
    <section
      id="video"
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #002235 0%, #003049 45%, #001830 100%)' }}
    >
      {/* Big faint ring behind the player */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <span style={{ fontSize: '26rem', lineHeight: 1, color: '#FFC945', filter: 'blur(3px)' }}>💍</span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <SectionHeader
          badge={videoSection.badge}
          badgeColor="#FFC945"
          lineColor="rgba(255,201,69,0.4)"
          subheading={videoSection.subheading}
        >
          {videoSection.headingBefore}{' '}
          <span className="text-gradient">{videoSection.headingHighlight}</span>
        </SectionHeader>

        <div className="flex flex-col gap-16">
          {videos.map((video, i) => (
            <VideoCard key={video.youtubeId || video.driveId || video.file || i} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
