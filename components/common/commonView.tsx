import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import HeaderComponent from "@/components/common/commonHeader";
import { IconType } from "react-icons";

interface CommonPageProps {
  iconName: string;
  iconComponent: IconType;
  formComponent?: React.ReactNode;
  cardContent: React.ReactNode;
}

const CommonPage: React.FC<CommonPageProps> = ({
  iconName,
  iconComponent,
  formComponent,
  cardContent,
}) => {
  return (
      <Card className="bg-slate-50">
        <CardHeader>
          <HeaderComponent iconName={iconName} iconComponent={iconComponent}>
            {formComponent}
          </HeaderComponent>
        </CardHeader>
        <CardContent>{cardContent}</CardContent>
      </Card>
  );
};

export default CommonPage;
