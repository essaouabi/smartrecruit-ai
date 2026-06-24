import { motion } from "framer-motion";

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
};

function PremiumStatCard({
  title,
  value,
  icon,
  gradient,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${gradient}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10" />

      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/80 text-sm">
              {title}
            </p>

            <h2 className="text-5xl font-black mt-2">
              {value}
            </h2>
          </div>

          <div className="text-4xl opacity-80">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PremiumStatCard;