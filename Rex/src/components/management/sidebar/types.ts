import type * as React from "react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
};

export type SidebarActionItem = {
  title: string;
  icon: React.ReactNode;
  render?: () => React.ReactNode;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatar?: string;
};
