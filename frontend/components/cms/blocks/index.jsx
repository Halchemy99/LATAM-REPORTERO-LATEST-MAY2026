'use client';

import { useTranslation } from '@/lib/providers';

// ============================================
// TEXT BLOCKS
// ============================================

export function ParagraphBlock({ content, locale }) {
  const text = content?.[`content_${locale}`]?.text || content?.content_en?.text || '';
  return (
    <p className="text-lg leading-relaxed mb-6" style={{ fontFamily: 'Source Serif 4, serif' }}>
      {text}
    </p>
  );
}

export function HeadingBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const level = data.level || 2;
  const text = data.text || '';
  
  const Tag = `h${level}`;
  const styles = {
    2: 'text-3xl md:text-4xl font-bold mt-12 mb-6',
    3: 'text-2xl md:text-3xl font-bold mt-10 mb-4',
    4: 'text-xl md:text-2xl font-semibold mt-8 mb-3'
  };
  
  return (
    <Tag className={styles[level]} style={{ fontFamily: 'Raleway, sans-serif' }}>
      {text}
    </Tag>
  );
}

export function SubheadingBlock({ content, locale }) {
  const text = content?.[`content_${locale}`]?.text || content?.content_en?.text || '';
  return (
    <p className="text-xl text-muted-foreground mb-6" style={{ fontFamily: 'Marcellus, serif' }}>
      {text}
    </p>
  );
}

export function PullQuoteBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <blockquote className="border-y-2 border-[#8c52ff] py-8 my-10 text-center">
      <p className="text-2xl md:text-3xl italic mb-4" style={{ fontFamily: 'Marcellus, serif' }}>
        "{data.quote}"
      </p>
      {data.attribution && (
        <footer className="text-muted-foreground">
          <span className="font-semibold">{data.attribution}</span>
          {data.title && <span className="text-sm ml-2">— {data.title}</span>}
        </footer>
      )}
    </blockquote>
  );
}

export function CalloutBoxBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const type = data.type || 'info'; // info, warning, success, error
  
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-amber-50 border-amber-500 text-amber-900',
    success: 'bg-green-50 border-green-500 text-green-900',
    error: 'bg-red-50 border-red-500 text-red-900'
  };
  
  return (
    <div className={`border-l-4 p-6 my-6 rounded-r-lg ${styles[type]}`}>
      {data.title && (
        <h4 className="font-bold mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {data.title}
        </h4>
      )}
      <p>{data.text}</p>
    </div>
  );
}

export function FactBoxBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="bg-[#E7DAC4]/30 p-6 my-6 rounded-lg">
      <h4 className="font-bold text-[#8c52ff] mb-3 uppercase text-sm tracking-wider" style={{ fontFamily: 'Raleway, sans-serif' }}>
        {data.title || 'Key Facts'}
      </h4>
      <ul className="space-y-2">
        {data.facts?.map((fact, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#8c52ff] mt-1">•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KeyTakeawaysBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="bg-gradient-to-r from-[#8c52ff]/10 to-[#6111ff]/10 p-6 my-6 rounded-lg border border-[#8c52ff]/20">
      <h4 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
        <svg className="w-5 h-5 text-[#8c52ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Key Takeaways
      </h4>
      <ul className="space-y-3">
        {data.takeaways?.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="bg-[#8c52ff] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// MEDIA BLOCKS
// ============================================

export function ImageBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const width = data.width || 'full'; // full, medium, small
  
  const widthClasses = {
    full: 'w-full',
    medium: 'max-w-2xl mx-auto',
    small: 'max-w-md mx-auto'
  };
  
  return (
    <figure className={`my-8 ${widthClasses[width]}`}>
      <img
        src={data.src}
        alt={data.alt || ''}
        className="w-full rounded-lg"
      />
      {(data.caption || data.credit) && (
        <figcaption className="mt-2 text-sm text-muted-foreground italic">
          {data.caption}
          {data.credit && <span className="ml-2">Photo: {data.credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function ImageGalleryBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const layout = data.layout || 'grid'; // grid, carousel, masonry
  
  if (layout === 'grid') {
    return (
      <div className="my-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.images?.map((img, i) => (
            <figure key={i} className="group">
              <img
                src={img.src}
                alt={img.alt || ''}
                className="w-full aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
              />
              {img.caption && (
                <figcaption className="mt-1 text-xs text-muted-foreground">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-8 overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {data.images?.map((img, i) => (
          <figure key={i} className="flex-shrink-0 w-72">
            <img
              src={img.src}
              alt={img.alt || ''}
              className="w-full h-48 object-cover rounded-lg"
            />
            {img.caption && (
              <figcaption className="mt-1 text-xs text-muted-foreground">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

export function VideoEmbedBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const { platform, videoId, caption } = data;
  
  let embedUrl = '';
  if (platform === 'youtube') {
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (platform === 'vimeo') {
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }
  
  if (platform === 'tiktok') {
    return (
      <figure className="my-8">
        <blockquote
          className="tiktok-embed mx-auto"
          cite={`https://www.tiktok.com/video/${videoId}`}
          data-video-id={videoId}
        >
          <section></section>
        </blockquote>
        <script async src="https://www.tiktok.com/embed.js"></script>
        {caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
  
  return (
    <figure className="my-8">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function AudioClipBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <figure className="my-8 bg-muted/30 p-4 rounded-lg">
      <audio controls className="w-full">
        <source src={data.src} type={data.type || 'audio/mpeg'} />
        Your browser does not support the audio element.
      </audio>
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function PodcastEmbedBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const { platform, embedCode, episodeUrl } = data;
  
  if (embedCode) {
    return (
      <div className="my-8" dangerouslySetInnerHTML={{ __html: embedCode }} />
    );
  }
  
  // Spotify embed
  if (platform === 'spotify' && episodeUrl) {
    const episodeId = episodeUrl.split('/episode/')[1]?.split('?')[0];
    return (
      <figure className="my-8">
        <iframe
          src={`https://open.spotify.com/embed/episode/${episodeId}`}
          width="100%"
          height="232"
          frameBorder="0"
          allow="encrypted-media"
          className="rounded-lg"
        />
      </figure>
    );
  }
  
  return null;
}

// ============================================
// VISUAL / DATA BLOCKS
// ============================================

export function ChartBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  // For now, render as an image. Could integrate Chart.js later
  return (
    <figure className="my-8">
      {data.imageUrl ? (
        <img src={data.imageUrl} alt={data.title || 'Chart'} className="w-full rounded-lg" />
      ) : (
        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <p className="text-muted-foreground">Chart: {data.title}</p>
        </div>
      )}
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function InfographicBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <figure className="my-8">
      <img
        src={data.src}
        alt={data.alt || 'Infographic'}
        className="w-full rounded-lg"
      />
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function TimelineBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8 relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8c52ff] to-[#6111ff]" />
      <div className="space-y-8">
        {data.events?.map((event, i) => (
          <div key={i} className="relative pl-12">
            <div className="absolute left-2 w-5 h-5 bg-[#8c52ff] rounded-full border-4 border-background" />
            <div className="bg-muted/30 p-4 rounded-lg">
              <span className="text-sm font-semibold text-[#8c52ff]">{event.date}</span>
              <h4 className="font-bold mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {event.title}
              </h4>
              {event.description && (
                <p className="text-muted-foreground mt-2">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataTableBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <figure className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#8c52ff] text-white">
            {data.headers?.map((header, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 border-b border-border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MapEmbedBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  
  if (data.embedCode) {
    return (
      <figure className="my-8">
        <div dangerouslySetInnerHTML={{ __html: data.embedCode }} className="rounded-lg overflow-hidden" />
        {data.caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {data.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  
  // Google Maps embed
  if (data.lat && data.lng) {
    return (
      <figure className="my-8">
        <iframe
          src={`https://maps.google.com/maps?q=${data.lat},${data.lng}&z=${data.zoom || 15}&output=embed`}
          width="100%"
          height="400"
          frameBorder="0"
          className="rounded-lg"
          allowFullScreen
        />
        {data.caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {data.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  
  return null;
}

// ============================================
// LAYOUT BLOCKS
// ============================================

export function DividerBlock() {
  return <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />;
}

export function SectionBreakBlock() {
  return (
    <div className="my-12 flex justify-center">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#8c52ff]" />
        <span className="w-2 h-2 rounded-full bg-[#8c52ff]" />
        <span className="w-2 h-2 rounded-full bg-[#8c52ff]" />
      </div>
    </div>
  );
}

export function TwoColumnBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8 grid md:grid-cols-2 gap-8">
      <div>
        {data.leftContent && (
          <p style={{ fontFamily: 'Source Serif 4, serif' }}>{data.leftContent}</p>
        )}
        {data.leftImage && (
          <img src={data.leftImage} alt="" className="w-full rounded-lg" />
        )}
      </div>
      <div>
        {data.rightContent && (
          <p style={{ fontFamily: 'Source Serif 4, serif' }}>{data.rightContent}</p>
        )}
        {data.rightImage && (
          <img src={data.rightImage} alt="" className="w-full rounded-lg" />
        )}
      </div>
    </div>
  );
}

export function HighlightSectionBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8 -mx-4 md:-mx-8 px-4 md:px-8 py-8 bg-gradient-to-r from-[#8c52ff]/5 to-[#6111ff]/5 border-y border-[#8c52ff]/20">
      {data.title && (
        <h3 className="font-bold text-xl mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {data.title}
        </h3>
      )}
      <p className="text-lg" style={{ fontFamily: 'Source Serif 4, serif' }}>
        {data.text}
      </p>
    </div>
  );
}

// ============================================
// ENGAGEMENT BLOCKS
// ============================================

export function NewsletterSignupBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8 bg-[#E7DAC4]/30 p-6 rounded-lg text-center">
      <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
        {data.title || 'Subscribe to our newsletter'}
      </h4>
      <p className="text-muted-foreground mb-4">{data.description}</p>
      <form className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8c52ff]"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export function CallToActionBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  const style = data.style || 'primary'; // primary, secondary, outline
  
  const buttonStyles = {
    primary: 'bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white hover:shadow-lg hover:shadow-[#8c52ff]/30',
    secondary: 'bg-[#E7DAC4] text-[#1a1919] hover:bg-[#E7DAC4]/80',
    outline: 'border-2 border-[#8c52ff] text-[#8c52ff] hover:bg-[#8c52ff] hover:text-white'
  };
  
  return (
    <div className="my-8 text-center p-8 bg-muted/30 rounded-lg">
      <h4 className="font-bold text-xl mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
        {data.title}
      </h4>
      {data.description && (
        <p className="text-muted-foreground mb-4">{data.description}</p>
      )}
      <a
        href={data.buttonUrl || '#'}
        className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${buttonStyles[style]}`}
      >
        {data.buttonText || 'Learn More'}
      </a>
    </div>
  );
}

export function RelatedArticlesBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8">
      <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
        Related Articles
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        {data.articles?.map((article, i) => (
          <a
            key={i}
            href={article.url}
            className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {article.image && (
              <img
                src={article.image}
                alt=""
                className="w-20 h-16 object-cover rounded"
              />
            )}
            <div>
              <h5 className="font-medium line-clamp-2">{article.title}</h5>
              <span className="text-xs text-muted-foreground">{article.category}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function SourcesListBlock({ content, locale }) {
  const data = content?.[`content_${locale}`] || content?.content_en || {};
  return (
    <div className="my-8 p-6 bg-muted/30 rounded-lg">
      <h4 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Sources
      </h4>
      <ol className="space-y-2">
        {data.sources?.map((source, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#8c52ff] font-semibold">{i + 1}.</span>
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8c52ff] hover:underline"
              >
                {source.name}
              </a>
              {source.accessed && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Accessed: {source.accessed})
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
