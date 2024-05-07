import homeSvg from "../assets/icons/home.svg";
import communitySvg from "../assets/icons/users.svg";
import collectionSvg from "../assets/icons/star.svg";
import jobsSvg from "../assets/icons/suitcase.svg";
import tagsSvg from "../assets/icons/tag.svg";
import profileSvg from "../assets/icons/user.svg";
import questionSvg from "../assets/icons/question.svg";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: homeSvg,
    route: "/",
    label: "Home",
  },
  {
    imgURL: communitySvg,
    route: "/community",
    label: "Community",
  },
  {
    imgURL: collectionSvg,
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: jobsSvg,
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: tagsSvg,
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: profileSvg,
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: questionSvg,
    route: "/ask-question",
    label: "Ask a question",
  },
];
