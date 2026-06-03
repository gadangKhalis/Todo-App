interface PremiumBadgeProps {
  isPremium: boolean;
}

export default function PremiumBadge({ isPremium }: PremiumBadgeProps) {
  return (
    <span className={isPremium ? "badge badge-premium" : "badge badge-free"}>
      {isPremium ? "⭐ Premium" : "Free"}
    </span>
  );
}
