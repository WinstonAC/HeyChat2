export function Avatar({ src }: { src?: string }) {
  return (
    <img
      src={src || '/placeholder-avatar.png'}
      alt="avatar"
      className="w-8 h-8 rounded-full object-cover border"
    />
  );
} 