"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocietyById } from "@/reducers/society.reducer";
import { RootState, AppDispatch } from "@/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, User2Icon, Home, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@/types";

// Define interfaces for your data structures
interface SocietyMember {
  id: string;
  name: string;
  phone?: string;
  type: "member";
}

interface Apartment {
  id: string;
  name: string;
  Department?: string;
  type: "apartment";
}

interface Society {
  admins: SocietyMember[];
  managers: SocietyMember[];
  Apartment: Apartment[];
}

interface ItemListProps {
  items: (SocietyMember | Apartment)[];
  icon: React.ReactNode;
}

const SocietyDashboard = () => {
  const loginUsers: User | null = useSelector(
    (state: RootState) => state.user.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSociety, status } = useSelector(
    (state: RootState) => state.society
  );
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState<string | null>(null);

  useEffect(() => {
    if (loginUsers?.currentSocietyId !== undefined) {
      const fetchSociety = async () => {
        try {
          await dispatch(
            getSocietyById(loginUsers?.currentSocietyId as number)
          );
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };
      fetchSociety();
    } else {
      setLoading(false);
    }
  }, [dispatch, loginUsers?.currentSocietyId]);

  const handleItemHover = (name: string) => setShowPhone(name);
  const handleItemLeave = () => setShowPhone(null);

  const mapMembersToType = (
    members: any[] = [],
    type: "member"
  ): SocietyMember[] => {
    return members.map((member) => ({
      ...member,
      type,
    }));
  };

  const mapApartmentsToType = (apartments: any[] = []): Apartment[] => {
    return apartments.map((apartment) => ({
      ...apartment,
      type: "apartment" as const,
    }));
  };

  const ItemList = ({ items, icon }: ItemListProps) => (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gradient-to-r from-gray-100 to-white rounded-lg p-2 flex items-center gap-2 shadow hover:shadow-md transition-all duration-200"
          onMouseEnter={() => handleItemHover(item.name)}
          onMouseLeave={handleItemLeave}
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-yellow-400 text-sm font-medium flex-shrink-0">
            {item.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            {showPhone !== item.name ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium truncate"
              >
                {item.name}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                <Phone size={12} className="flex-shrink-0" />
                <span className="text-xs font-medium truncate">
                  {item.type === "member"
                    ? item.phone
                    : item.Department || "N/A"}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {selectedSociety && (
        <>
          <Card className="border border-[#374151] hover:border-yellow-500 transition-colors duration-200">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base font-bold flex items-center">
                <UserIcon className="mr-2" size={16} />
                Admins
                <span className="text-sm font-medium ml-2 text-gray-600">
                  ({selectedSociety.admins?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ItemList
                items={mapMembersToType(selectedSociety.admins, "member")}
                icon={<UserIcon size={16} />}
              />
            </CardContent>
          </Card>

          <Card className="border border-[#374151] hover:border-yellow-500 transition-colors duration-200">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base font-bold flex items-center">
                <User2Icon className="mr-2" size={16} />
                Managers
                <span className="text-sm font-medium ml-2 text-gray-600">
                  ({selectedSociety.managers?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ItemList
                items={mapMembersToType(selectedSociety.managers, "member")}
                icon={<User2Icon size={16} />}
              />
            </CardContent>
          </Card>

          <Card className="border border-[#374151] hover:border-yellow-500 transition-colors duration-200">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base font-bold flex items-center">
                <Home className="mr-2" size={16} />
                Apartments
                <span className="text-sm font-medium ml-2 text-gray-600">
                  ({selectedSociety.Apartment?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ItemList
                items={mapApartmentsToType(selectedSociety.Apartment)}
                icon={<Home size={16} />}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocietyDashboard;
