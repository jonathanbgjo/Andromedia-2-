import { avatarColor, initial } from "../../util/format";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
}

/** Circular channel avatar. Uses an image when available, otherwise a
 *  colored initial — the same pattern YouTube uses for channels with no art. */
export default function Avatar({ name, src, size = 36 }: AvatarProps) {
  const dimension = { width: size, height: size, flexShrink: 0 } as const;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "channel"}
        style={{ ...dimension, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      aria-hidden
      style={{
        ...dimension,
        borderRadius: "50%",
        background: avatarColor(name || "?"),
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 500,
        fontSize: size * 0.45,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {initial(name)}
    </div>
  );
}
