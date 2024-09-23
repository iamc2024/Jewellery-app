// import { NextResponse } from 'next/server';
// import { validateRequest } from './auth';
// import prisma from './lib/prisma';

// export const middleware = async (req: Request) => {
//    const { user: loggedInUser } = await validateRequest();

//    if (!loggedInUser) {
//       return NextResponse.redirect('/login');
//    }

//    const user = await prisma.user.findUnique({
//       where: { id: loggedInUser.id },
//    });

//    if (
//       !user ||
//       !user.isMember ||
//       !user.membershipEnd ||
//       new Date(user.membershipEnd) < new Date()
//    ) {
//       return NextResponse.redirect('/membership'); // Redirect to upgrade page
//    }

//    return NextResponse.next();
// };

// export const config = {
//     matcher: ['/*'], // Adjust based on your routes
//   };
