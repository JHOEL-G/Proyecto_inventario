import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, trend, isLoading }) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
              {trend && (
                <p className="text-xs text-slate-500">{trend}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}