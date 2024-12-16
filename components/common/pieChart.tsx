"use client";

import { User as UserIcon } from "lucide-react";
import { FaRegBuilding } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ApartmentData {
  apartment: string;
  members: number;
  fill?: string;
}

interface BarChartProps {
  data: ApartmentData[];
}

// Predefined color palette to ensure visually appealing colors
const COLORS = [
  "rgb(59, 130, 246)", // blue-500
  "rgb(16, 185, 129)", // green-500
  "rgb(236, 72, 153)", // pink-500
  "rgb(245, 158, 11)", // amber-500
  "rgb(139, 92, 246)", // violet-500
  "rgb(239, 68, 68)", // red-500
  "rgb(14, 165, 233)", // sky-500
  "rgb(168, 85, 247)", // purple-500
  "rgb(234, 88, 12)", // orange-500
  "rgb(20, 184, 166)", // teal-500
];

const getRandomColor = (index: number) => {
  // Use modulo to cycle through colors if there are more bars than colors
  return COLORS[index % COLORS.length];
};

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  // Add random colors to the data
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: getRandomColor(index),
  }));

  const chartConfig = {
    members: {
      label: "Members",
      color: "rgb(59, 130, 246)", // Default color for config
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-white w-full h-full min-h-[300px] sm:min-h-[410px]">
      <CardHeader className="py-3">
        <CardTitle className="text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaRegBuilding className="mr-2" size={16} />
              Department 
            </div>
          </div>
        </CardTitle>
        <CardDescription>Showing total members</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={coloredData}
            layout="vertical"
            margin={{
              left: 0,
              right: 20,
              top: 5,
              bottom: 5,
            }}
            barCategoryGap={8}
          >
            <YAxis
              dataKey="apartment"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis dataKey="members" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="members"
              layout="vertical"
              radius={[0, 5, 5, 0]}
              fill=""
            >
              <LabelList
                dataKey="members"
                position="right"
                className="fill-muted-foreground text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
