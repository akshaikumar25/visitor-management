import React, { useState } from "react";
import { PieChart, Pie, Sector, Cell, Label } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { User as UserIcon, User2Icon, Home, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PieChartData {
  month: string;
  desktop: number;
  fill: string;
}

interface InteractivePieChartProps {
  data: PieChartData[];
  chartConfig: ChartConfig;
}

// Custom color palette
const COLORS = {
  jan: "rgb(59, 130, 246)",    // blue-500
  feb: "rgb(16, 185, 129)",    // green-500
  mar: "rgb(236, 72, 153)",    // pink-500
  apr: "rgb(245, 158, 11)",    // amber-500
  may: "rgb(139, 92, 246)",    // violet-500
  jun: "rgb(239, 68, 68)",     // red-500
  jul: "rgb(14, 165, 233)",    // sky-500
  aug: "rgb(34, 197, 94)",     // emerald-500
  sep: "rgb(168, 85, 247)",    // purple-500
  oct: "rgb(249, 115, 22)",    // orange-500
  nov: "rgb(99, 102, 241)",    // indigo-500
  dec: "rgb(234, 88, 12)"      // orange-600
};

export function InteractivePieChart({
  data,
  chartConfig,
}: InteractivePieChartProps) {
  const hasData = data && data.length > 0;
  const [activeMonth, setActiveMonth] = useState(hasData ? data[0].month : '');
  const id = "interactive-pie";
  const activeIndex = hasData ? data.findIndex((item) => item.month === activeMonth) : -1;
  const months = hasData ? data.map((item) => item.month) : [];

  // Map colors to data
  const coloredData = data.map(item => ({
    ...item,
    fill: COLORS[item.month.toLowerCase().substring(0, 3) as keyof typeof COLORS] || COLORS.jan
  }));

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-4 sm:p-8">
      <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">0</span>
      <span className="text-xs sm:text-sm text-muted-foreground mt-2">No data available</span>
    </div>
  );

  return (
    <Card 
      data-chart={id} 
      className="flex flex-col border-white w-full h-full min-h-[300px] sm:min-h-[350px]"
    >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="mr-1 sm:mr-2" size={16}/>
              Visitor Count
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
        Showing total Visitor 
        </CardDescription>
        {hasData && (
          <Select value={activeMonth} onValueChange={setActiveMonth}>
            <SelectTrigger
              className="ml-auto h-6 sm:h-7 w-[100px] sm:w-[130px] rounded-lg pl-1.5 sm:pl-2.5 text-xs sm:text-sm"
              aria-label="Select a month"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {months.map((month) => (
                <SelectItem
                  key={month}
                  value={month}
                  className="rounded-lg [&_span]:flex text-xs"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className="flex h-2 w-2 sm:h-3 sm:w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: COLORS[month.toLowerCase().substring(0, 3) as keyof typeof COLORS] || COLORS.jan
                      }}
                    />
                    {chartConfig[month.toLowerCase()]?.label || month}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0 px-2 sm:px-4">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] sm:max-w-[300px] md:max-w-[300px]"
        >
          {hasData ? (
            <PieChart width={450} height={450}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={coloredData}
                dataKey="desktop"
                nameKey="month"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                      fill={coloredData[activeIndex]?.fill}
                    />
                  </g>
                )}
              >
                {coloredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl sm:text-2xl font-bold"
                          >
                            {coloredData[activeIndex]?.desktop?.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <EmptyState />
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default InteractivePieChart;