
import type { User } from "@prisma/client";
import prisma from "./prisma";


export const assignMembership = async (userId:string, membershipId:string) =>  {
  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
  });

  if (!membership) {
    throw new Error('Membership not found');
  }

  const startDate = new Date();
  let endDate;

endDate = new Date();
endDate.setDate(endDate.getDate() + membership.duration);

  await prisma.user.update({
    where: { id: userId },
    data: {
      isMember: true,
      membershipId: membershipId,
      membershipStart: startDate,
      membershipEnd: endDate,
    },
  });
}

export const getRemainingDays = (membershipEnd: Date) => {
  if (!membershipEnd) return 0;

  const today = new Date();
  const endDate = new Date(membershipEnd);
  const timeDiff = endDate.getTime() - today.getTime();

  if (timeDiff <= 0) return 0;

  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}