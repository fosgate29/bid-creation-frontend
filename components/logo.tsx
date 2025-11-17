export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield shape representing security */}
      <path
        d="M20 2L6 8v10c0 8.84 6.12 17.09 14 19 7.88-1.91 14-10.16 14-19V8L20 2z"
        fill="currentColor"
        className="text-primary"
      />
      {/* ZK abbreviation */}
      <path
        d="M13 14h6v2l-4 4h4v2h-6v-2l4-4h-4v-2z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M22 14h2v4l3-4h2l-3 4 3 4h-2l-3-4v4h-2v-8z"
        fill="white"
        opacity="0.95"
      />
      {/* Blockchain link icon at bottom */}
      <circle cx="16" cy="28" r="1.5" fill="white" opacity="0.7" />
      <circle cx="20" cy="28" r="1.5" fill="white" opacity="0.7" />
      <circle cx="24" cy="28" r="1.5" fill="white" opacity="0.7" />
      <line x1="17.5" y1="28" x2="18.5" y2="28" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="21.5" y1="28" x2="22.5" y2="28" stroke="white" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
