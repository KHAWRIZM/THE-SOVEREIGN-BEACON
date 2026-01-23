
export default function Logo({ spin=true, size=38 }) {
  return (
    <div className={`logo ${spin ? 'spin' : ''}`} style={{ width:size, height:size }} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <circle className="ring" cx="50" cy="50" r="32"/>
        <path className="bolt" d="M56 12 L28 58 L48 58 L44 88 L72 42 L52 42 Z"/>
      </svg>
    </div>
  )
}
