import cn from "classnames";

type TextProps = {
  variant: "Title" | "Subtitle" | "Body" | "Small" | "Caption" | "Link";
  children: React.ReactNode;
  className?: string;
};

export default function Text({
  variant = "Body",
  children,
  className = "",
}: TextProps) {
  const variants = {
    Title: "text-xl font-semibold text-black/80",
    Subtitle: "text-lg text-black/70",
    Body: "text-base text-black/40",
    Small: "text-sm font-medium text-black/60",
    Caption: "text-sm text-black/50",
    Link: "text-blue-500 underline",
  };

  return (
    <p className={cn("font-sans", variants[variant], className)}>{children}</p>
  );
}
