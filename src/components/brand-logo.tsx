import Image from "next/image";
import Link from "next/link";

type Props = {
  href: string;
  variant?: "light" | "dark";
};

export function BrandLogo({ href, variant = "light" }: Props) {
  return (
    <Link href={href} className={`brand-logo brand-logo-${variant}`}>
      <Image
        src="/logo.png"
        alt="WasteTrack Ghana"
        width={36}
        height={36}
        className="brand-mark"
        priority
      />
      <span className="brand-word">
        WasteTrack <span>Ghana</span>
      </span>
    </Link>
  );
}
