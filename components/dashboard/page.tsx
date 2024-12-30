"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocietyById } from "@/reducers/society.reducer";
import { RootState, AppDispatch } from "@/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, ShieldCheck, Users, Phone } from "lucide-react";
import BarChartComponent from "@/components/common/pieChart";
import { InteractivePieChart } from "@/components/common/pieChartMonths";
import { Badge } from "@/components/ui/badge";
import { VisitorsRadialChart } from "@/components/common/radialChart";
import { VisitorsPieChart } from "@/components/common/piechartvisitor";

interface SocietyMember {
  id: string;
  name: string;
  phone?: string;
  type: "member";
  role: "admin" | "manager";
}

interface ApartmentInfo {
  apartment: string;
  members: number;
}

const MemberSection = ({
  title,
  icon: Icon,
  members,
}: {
  title: string;
  icon: React.ElementType;
  members: SocietyMember[];
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} />
      <span className="font-medium text-sm">{title}</span>
      <span className="text-sm text-gray-500">({members.length})</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {members.map((member) => (
        <div key={member.id} className="flex flex-col space-y-2 group">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 hover:bg-[#1E3A8A] transition-colors cursor-default w-full relative h-8 px-2"
          >
            <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-xs font-medium text-black border border-[#1E3A8A]">
              <UserIcon />
            </span>
            <span className="group-hover:opacity-0 transition-opacity duration-300 absolute left-8">
              {member.name}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white duration-300 absolute left-8">
              {member.phone || "No phone"}
            </span>
          </Badge>
        </div>
      ))}
    </div>
  </div>
);

const SocietyDashboard = () => {
  const loginUsers = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSociety, status } = useSelector(
    (state: RootState) => state.society
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const societyId = loginUsers?.currentSocietyId;

    if (typeof societyId === "number") {
      const fetchSociety = async () => {
        try {
          await dispatch(getSocietyById(societyId));
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };
      fetchSociety();
    } else {
      // Handle the case when societyId is undefined
      setLoading(false);
    }
  }, [dispatch, loginUsers?.currentSocietyId]);

  const mapMembersToType = (
    members: any[] = []
  ): { admins: SocietyMember[]; managers: SocietyMember[] } => {
    const admins = members
      .filter((member) => member.role === "Admin")
      .map((member) => ({
        ...member,
        type: "member" as const,
        role: "admin",
      }));

    const managers = members
      .filter((member) => member.role === "Manager")
      .map((member) => ({
        ...member,
        type: "member" as const,
        role: "manager",
      }));

    return { admins, managers };
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const getCurrentApartmentMemberCount = () => {
    const apartmentData: ApartmentInfo[] = [];

    if (selectedSociety?.Apartment) {
      selectedSociety.Apartment.forEach((apartment) => {
        // Start with the existing members count
        let memberCount = apartment?.users
          ? Object.keys(apartment.users).length
          : 0;

        apartmentData.push({
          apartment: apartment.name,
          members: memberCount,
        });
      });
    }

    return apartmentData;
  };

  const getVisitorStatusForToday = () => {
    // Get today's date
    const today = new Date();

    // Iterate through all apartments in the society
    let totalVisitors = 0;
    let approvedVisitors = 0;
    let pendingVisitors = 0;
    let rejectedVisitors = 0;

    selectedSociety?.Apartment?.forEach((apartment) => {
      apartment?.Visitor?.forEach((visitor) => {
        // Convert visitor's fromdate to Date object
        const visitorDateTime = new Date(visitor.fromdate);

        // Check if visitor's date matches today's date
        if (
          visitorDateTime.getFullYear() === today.getFullYear() &&
          visitorDateTime.getMonth() === today.getMonth() &&
          visitorDateTime.getDate() === today.getDate()
        ) {
          // Increment visitor count by 1 instead of using visitor.visitorscount
          totalVisitors += 1;

          switch (visitor.approvalstatus) {
            case "Approved":
              approvedVisitors += 1;
              break;
            case "Denied":
              rejectedVisitors += 1;
              break;
            case "Pending":
              pendingVisitors += 1;
              break;
          }
        }
      });
    });

    return {
      total: totalVisitors,
      approved: approvedVisitors,
      pending: pendingVisitors,
      rejected: rejectedVisitors,
    };
  };

  const visitorStatusToday = getVisitorStatusForToday();

  const getTodayVisitorCounts = () => {
    // Create start of today with only date components
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    let totalVisitors = 0;
    let scheduledVisitors = 0;
    let approvedVisitors = 0;
    let departedVisitors = 0;

    // Iterate through all apartments in the society
    selectedSociety?.Apartment?.forEach((apartment) => {
      apartment?.Visitor?.forEach((visitor) => {
        const visitorDate = new Date(visitor.fromdate);

        // Compare only year, month, and date
        if (
          visitorDate.getFullYear() === startOfToday.getFullYear() &&
          visitorDate.getMonth() === startOfToday.getMonth() &&
          visitorDate.getDate() === startOfToday.getDate()
        ) {
          const visitorCount = visitor.visitorscount || 0;
          totalVisitors += visitorCount;

          // Count visitors by status
          switch (visitor.visitorstatus) {
            case "Scheduled":
              scheduledVisitors += visitorCount;
              break;
            case "Arrived":
              approvedVisitors += visitorCount;
              break;
            case "Departed":
              departedVisitors += visitorCount;
              break;
          }
        }
      });
    });

    return {
      total: totalVisitors,
      scheduled: scheduledVisitors,
      approved: approvedVisitors,
      departed: departedVisitors,
    };
  };

  const visitorCounts = getTodayVisitorCounts();
  const getCurrentMonthGuestCount = () => {
    const currentMonth = new Date().getMonth();
    const guestCounts = [];
    for (let i = 0; i <= currentMonth; i++) {
      let totalGuests = 0;
      selectedSociety?.Apartment?.forEach((apartment) => {
        const currentMonthGuests = apartment?.Visitor?.filter((guest) => {
          const guestDate = new Date(guest.fromdate ?? "");
          return guestDate.getMonth() === i;
        });
        totalGuests += currentMonthGuests.reduce(
          (sum, guest) => sum + (guest.visitorscount || 0),
          0
        );
      });

      if (totalGuests > 0) {
        guestCounts.push({
          month: new Date(0, i, 1).toLocaleString("default", {
            month: "short",
          }),
          desktop: totalGuests,
          fill: `hsl(var(--chart-${i + 1}))`,
        });
      }
    }
    return guestCounts;
  };

  const chartConfig = {
    jan: { label: "January", color: "hsl(var(--chart-1))" },
    february: { label: "February", color: "hsl(var(--chart-2))" },
    march: { label: "March", color: "hsl(var(--chart-3))" },
    april: { label: "April", color: "hsl(var(--chart-4))" },
    may: { label: "May", color: "hsl(var(--chart-5))" },
    june: { label: "June", color: "hsl(var(--chart-6))" },
  };

  const { admins, managers } = mapMembersToType(selectedSociety?.admins || []);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full border border-[#374151] hover:border-[#1E3A8A] transition-colors duration-200">
          <CardContent className="p-2 sm:p-4 space-y-3">
            <MemberSection title="Admins" icon={ShieldCheck} members={admins} />
          </CardContent>
        </Card>
        <Card className="w-full border border-[#374151] hover:border-[#1E3A8A] transition-colors duration-200">
          <CardContent className="p-2 sm:p-4 space-y-3">
            <MemberSection title="Managers" icon={Users} members={managers} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full border hover:border-[#1E3A8A] transition-colors duration-200">
          <div className="flex flex-col">
            <InteractivePieChart
              data={getCurrentMonthGuestCount()}
              chartConfig={chartConfig}
            />
            <VisitorsRadialChart
              total={visitorCounts.total}
              scheduled={visitorCounts.scheduled}
              approved={visitorCounts.approved}
              departed={visitorCounts.departed}
            />
          </div>
        </Card>
        <Card className="w-full border hover:border-[#1E3A8A] transition-colors duration-200">
          <div className="flex flex-col">
            <BarChartComponent data={getCurrentApartmentMemberCount()} />
            <VisitorsPieChart
              total={visitorStatusToday.total}
              approved={visitorStatusToday.approved}
              pending={visitorStatusToday.pending}
              rejected={visitorStatusToday.rejected}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SocietyDashboard;
