import userIcon from "@/public/images/admin/parterner.png";

export type Job = {
  id: number;
  img: string;
  name: string;
  subscription: string;
  email: string;
  profession: string;
  connections: string;
  status: string;
  joined: string;
};

export const initialJobs: Job[] = [
  {
    id: 1,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 2,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 3,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 4,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 5,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Inactive",
    joined: "2024-01-15",
  },
  {
    id: 6,
    img: userIcon.src,
    name: "Clinical Psychologist",
    subscription: "Basic",
    email: "rachel@gmail.com",
    profession: "Clinical Psychologist",
    connections: "125",
    status: "Active",
    joined: "2024-01-15",
  },
];
