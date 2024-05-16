const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const createAdmin = async () => {
  await prisma.admin.create({
    data: {
      name: "Admin",
      email: faker.internet.email(),
    },
  });
};

const createSkills = async () => {
  for (let i = 0; i < 10; i++) {
    await prisma.skill.create({
      data: {
        name: faker.lorem.word(),
        skill_type: i % 2 === 0 ? "digital" : "physical",
        adminId: 1,
      },
    });
  }
};

const createUsers = async () => {
  // create 10k users
  for (let i = 0; i < 10000; i++) {
    try {
      await prisma.user.create({
        data: {
          name: faker.person.fullName() + i.toString(),
          email: faker.internet.email() + i.toString(),
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
};

const addSkillsToUsers = async () => {
  // add 10 skills to each user
  const users = await prisma.user.findMany();
  const skills = await prisma.skill.findMany();

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 10; j++) {
      await prisma.userSkill.create({
        data: {
          userId: users[i].id,
          skillId: skills[j].id,
          level: Math.floor(Math.random() * 10),
        },
      });
    }
  }
};

const seed = async () => {
  await createAdmin();
  await createSkills();
  await createUsers();
  await addSkillsToUsers();

  // count admin, skills, users, user_skills
  const adminCount = await prisma.admin.count();
  const skillCount = await prisma.skill.count();
  const userCount = await prisma.user.count();
  const userSkillCount = await prisma.userSkill.count();
  console.log({ adminCount, skillCount, userCount, userSkillCount });
};

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
