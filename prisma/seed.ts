import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const serviceType = await prisma.serviceType.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Site',
      },
      {
        name: 'Logo',
      },
      {
        name: 'Social',
      },
    ],
  });

  const serviceTypeChoose = await prisma.serviceTypeChoose.createMany({
    data: [
      {
        name: 'OnePage',
      },
      {
        name: '3Pages',
      },
      {
        name: 'Complete',
      },
    ],
    skipDuplicates: true,
  });

  const serviceNetwork = await prisma.serviceNetworkType.createMany({
    data: [
      {
        name: 'Instagram',
      },
      {
        name: 'Youtube',
      },
      {
        name: 'Facebook',
      },
    ],
    skipDuplicates: true,
  });

  const serviceMidia = await prisma.servicePostsType.createMany({
    data: [
      {
        name: 'Feed',
      },
      {
        name: 'Stories',
      },
      {
        name: 'Reels',
      },
    ],
    skipDuplicates: true,
  });

  const roleType = await prisma.roleType.createMany({
    data: [
      {
        id: 1,
        name: 'Cliente',
      },
      {
        id: 2,
        name: 'Empregado',
      },
      {
        id: 3,
        name: 'Admin',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
