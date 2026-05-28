'use client';

/**
 * Journalist verification badge.
 * level: 'staff' = solid purple (full staff, ID verified)
 *        'id-verified' = teal outline (freelance/contributor, ID checked)
 *        undefined/null = no badge shown
 */
export default function VerifiedBadge({ level, size = 'sm' }) {
  if (!level) return null;

  const isStaff = level === 'staff';
  const label = isStaff ? 'Staff Reporter · ID Verified' : 'ID Verified Journalist';

  const dim = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 ${dim} ${
        isStaff
          ? 'bg-[#6111ff] text-white'
          : 'border border-[#0d9488] text-[#0d9488] bg-transparent'
      }`}
    >
      {/* Checkmark SVG — drawn to fit tight in circle */}
      <svg viewBox="0 0 10 10" fill="none" className="w-full h-full p-[1.5px]">
        <polyline
          points="2,5.5 4,7.5 8,3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
