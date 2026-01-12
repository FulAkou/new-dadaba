import { cn } from "@/lib/utils/cn";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-6 bg-white rounded-3xl border border-secondary-100 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-black font-outfit text-secondary-900">
            {value}
          </h3>

          {trend && (
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  trend === "up"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {trend === "up" ? "+" : "-"}
                {trendValue}%
              </span>
              <span className="text-xs text-secondary-400 font-medium">
                vs mois dernier
              </span>
            </div>
          )}
        </div>

        <div className="p-3 bg-secondary-50 text-secondary-600 rounded-2xl">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
