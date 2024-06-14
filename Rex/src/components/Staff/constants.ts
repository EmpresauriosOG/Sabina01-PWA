import { Roles, User } from "@/hooks/tanstack/getUser";
export interface Staff extends User {
  status?: string;
}

export const staff: Staff[] = [
  {
    restaurant_id: "m5gr84i9",
    first_name: "Fernando",
    last_name: "Gonzalez",
    email: "emai@gmail.com",
    location_id: "1",
    roles: [Roles.admin],
    status: "active",
  },
  {
    restaurant_id: "m5gr84i9",
    first_name: "Fernando2",
    last_name: "Gonzale2z",
    email: "emai@gmai2l.com",
    location_id: "1",
    roles: [Roles.admin],
    status: "active",
  },
  {
    restaurant_id: "m5gr84i9",
    first_name: "Fernando3",
    last_name: "Gonzalez3",
    email: "emai@gmail3.com",
    location_id: "1",
    roles: [Roles.admin],
    status: "notActive",
  },
];
