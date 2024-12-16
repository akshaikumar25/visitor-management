"use client"
import React from "react"
import { User as UserIcon } from "lucide-react";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface VisitorsRadialChartProps {
  total: number;
  scheduled: number;
  approved: number;
  departed: number;
  title?: string;
  description?: string;
  trendPercentage?: number;
}

export function VisitorsRadialChart({
  total,
  scheduled,
  approved,
  departed,
  title = "Visitors Overview",
  description = "Today's Visitor Status",
  trendPercentage = 0
}: VisitorsRadialChartProps) {
  if (total === 0) {
    return (
      <Card className="flex flex-col border-white w-full h-full min-h-[300px] sm:min-h-[420px]">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AiOutlineUserSwitch className="mr-1 sm:mr-2" size={16}/>
              Visitor Status
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
        Visitors registered today
        </CardDescription>
      </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p className="text-muted-foreground text-center mt-32">
          No visitors are scheduled for today
          </p>
        </CardContent>
      </Card>
    );
  }
  const chartData = [{ 
    name: 'Visitors',
    scheduledVisitors: scheduled, 
    arrivedVisitors: approved, 
    departedVisitors: departed 
  }]

  // Define chart configuration with explicit colors
  const chartConfig = {
    scheduledVisitors: {
      label: "Scheduled",
       color: "#4D96FF", // Bright red/coral
    },
    arrivedVisitors: {
      label: "Arrived",
      color: "#4ECB71", // Green
    },
    departedVisitors: {
      label: "Departed",
      color: "#FF6B6B"// Blue
    }
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col border-white">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AiOutlineUserSwitch className="mr-1 sm:mr-2" size={16}/>
              Visitor Status
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
        Visitors registered today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center mt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130} 
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="scheduledVisitors"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.scheduledVisitors.color}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="arrivedVisitors"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.arrivedVisitors.color}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="departedVisitors"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.departedVisitors.color}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm p-2 sm:p-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span className="text-green-500">Approved: {approved}</span>
          <span className="text-[#4D96FF]">Scheduled: {scheduled}</span>
          <span className="text-[#FF6B6B]">Departed: {departed}</span>
        </div>
      </CardFooter>
    </Card>
  )
}