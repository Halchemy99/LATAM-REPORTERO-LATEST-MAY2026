'use client';

import { PortableText } from '@portabletext/react';

const portableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-serif font-semibold text-[#1a1a1a] mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-serif font-semibold text-[#1a1a1a] mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-base text-[#2C1A3D] leading-relaxed mb-4 font-serif">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#6110ff] pl-4 my-6 italic text-[#666666] font-serif">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#6110ff] underline hover:text-[#4a0dd6] transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1 text-[#2C1A3D] font-serif">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1 text-[#2C1A3D] font-serif">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
  },
};

export default function SanityPortableText({ content }) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return <p className="text-[#666666] italic">No content available.</p>;
  }

  return (
    <div className="portable-text-content" data-testid="article-body">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}
