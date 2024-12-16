import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Shield, Users, Building, Briefcase } from 'lucide-react';

export const ServiceCard = ({ Icon, title, description }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="w-full sm:w-1/2 lg:w-1/4 p-4"
  >
    <Card className="h-full">
      <CardHeader className="flex flex-col items-center">
        <Icon className="w-12 h-12 text-blackmb-2" />
        <h3 className="text-xl font-semibold text-black">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);