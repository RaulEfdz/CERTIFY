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
    <div className="flex flex-col space-y-4 mb-8 p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-white/10" />
              <Skeleton className="h-4 w-48 bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
              {organization && (
                <div className="flex items-center text-sm text-white/80">
                  <Icons.home className="mr-2 h-4 w-4 text-white/70" />
                  <span>{organization.name}</span>
                </div>
              )}
            </>
          )}
          {description && (
            <p className="text-sm text-white/70 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
