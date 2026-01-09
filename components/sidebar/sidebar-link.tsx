"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Text from "../text";

export default function SidebarLink({
  label,
  icon,
  href,
  badgeCount,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
  badgeCount?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "h-8 w-full rounded-xl px-2 mt-1.5 cursor-pointer grid grid-cols-[auto_1fr_auto] items-center gap-4",
        { "bg-[#f3f5f7] hover:bg-[#f3f5f7]/70": isActive },
        { "bg-transparent hover:bg-[#f3f5f7]": !isActive },
      )}
    >
      {icon}
      <Text variant="Caption" className="text-black/90">
        {label}
      </Text>
      {badgeCount && (
        <span className="text-xs text-white bg-[#226745]/10 rounded-lg p-0.5 w-8 font-mono text-center">
          <Text variant="Caption" className="text-black/70 text-xs">
            {badgeCount}
          </Text>
        </span>
      )}
    </Link>
  );
}
