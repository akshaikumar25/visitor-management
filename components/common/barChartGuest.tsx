"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GuestCountBarChart = ({ data }: any) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center">
          Guest Count by Month
        </CardTitle>
        <CardDescription className="text-sm">Current Year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" tickSize={8} />
            <YAxis tickSize={8} />
            <Tooltip />
            <Legend
              wrapperStyle={{
                fontSize: "0.45rem",
                fontWeight: "medium",
              }}
            />
            <Bar dataKey="count" fill="var(--color-primary)" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-3 w-3" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total guests by month for the current year
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuestCountBarChart;