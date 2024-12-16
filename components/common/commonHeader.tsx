import React from 'react';
import { IconType } from 'react-icons';
import { TbBuildingStore } from "react-icons/tb"; 

interface HeaderComponentProps {
  iconName: string;
  iconComponent: IconType;
  children?: React.ReactNode; // Make children optional
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ iconName, iconComponent: IconComponent, children }) => {
  return (
    <div className="w-full h-[7vh] bg-gray-500 flex justify-between items-center px-4 rounded-xl">
      <div className="flex flex-row justify-center items-center">
        <div className="p-2 bg-white rounded-full shadow-md mr-4">
          {IconComponent ? <IconComponent size={25} /> : <TbBuildingStore size={25} />}
        </div>
        <p className="text-xl font-extrabold text-white">{iconName}</p>
      </div>
      {children} {/* Render children if they are provided */}
    </div>
  );
};

export default HeaderComponent;