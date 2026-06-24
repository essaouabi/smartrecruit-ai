import { motion } from "framer-motion";

type Props = {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

function StatCard({
  title,
  value,
  color,
  icon,
}: Props) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      className="bg-white rounded-3xl p-6 border shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className={`text-4xl font-black mt-2 ${color}`}>
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;