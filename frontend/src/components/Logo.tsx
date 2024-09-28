import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
  imgWidth = 45,
  imgHeight = 45,
}: {
  src: string | null;
  children?: React.ReactNode;
  imgWidth?: number;
  imgHeight?: number;
}) {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2"
    >
      {src && (
        <Image src={src} alt="logo" width={imgWidth} height={imgHeight} />
      )}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
