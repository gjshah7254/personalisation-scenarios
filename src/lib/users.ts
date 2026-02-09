import type { User, Segment } from "@/lib/types";
import usersData from "@/data/users.json";

const users: User[] = usersData.users as User[];

export function getUsers(): User[] {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersBySegment(segment: Segment): User[] {
  return users.filter((u) => u.segment === segment);
}

export function getSegmentUsers(): { segmentA: User[]; segmentB: User[] } {
  return {
    segmentA: users.filter((u) => u.segment === "A"),
    segmentB: users.filter((u) => u.segment === "B"),
  };
}
