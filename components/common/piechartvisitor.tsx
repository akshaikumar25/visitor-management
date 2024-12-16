"use client"
import * as React from "react"
import { TrendingUp, UserIcon } from "lucide-react"
import { MdApproval } from "react-icons/md";
import { Label, Pie, PieChart, Cell } from "recharts"
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

interface VisitorChartProps {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export function VisitorsPieChart({ total, approved, pending, rejected }: VisitorChartProps) {
  // If total is 0, render a message instead of the chart
  if (total === 0) {
    return (
      <Card className="flex flex-col border-white w-full h-full min-h-[300px] sm:min-h-[420px]">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdApproval className="mr-1 sm:mr-2" size={16}/>
              Approval Status
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
        Visitors request today
        </CardDescription>
      </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p className="text-muted-foreground text-center mt-32">
            There are no requests made for today
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { status: "approved", visitors: approved },
    { status: "pending", visitors: pending },
    { status: "rejected", visitors: rejected },
  ]

  const COLORS = {
    approved: "#22c55e", // green-500
    pending: "#f97316", // orange-500
    rejected: "#FF0000", // red
  }

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    approved: {
      label: "Approved",
      color: COLORS.approved,
    },
    pending: {
      label: "Pending",
      color: COLORS.pending,
    },
    rejected: {
      label: "Rejected",
      color: COLORS.rejected,
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col border-white w-full h-full min-h-[300px] sm:min-h-[420px]">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdApproval className="mr-1 sm:mr-2" size={16}/>
              Approval Status
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
        Visitors request today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] mt-4"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="status"
              innerRadius={55}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.status as keyof typeof COLORS]} 
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Request
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm p-2 sm:p-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span className="text-green-500">Approved: {approved}</span>
          <span className="text-orange-500">Pending: {pending}</span>
          <span className="text-red-500">Rejected: {rejected}</span>
        </div>
      </CardFooter>
    </Card>
  )
}