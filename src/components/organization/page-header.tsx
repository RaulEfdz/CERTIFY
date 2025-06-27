"use client";

import { useOrganization } from "@/contexts/organization-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const { organization, isLoading } = useOrganization();

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {organization && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.building className="mr-2 h-4 w-4" />
                  <span>{organization.name}</span>
                </div>
              )}
            </>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
