import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

dotenv.config();

const app: Express = express();

app.use(cors());

const server = http.createServer(app);

const port = process.env.PORT || 4000;

export const prisma = new PrismaClient();

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.get("/prisma", async (req: Request, res: Response) => {
  try {
    const usersWithDigitalSkillsPrisma = await prisma.user.findMany({
      where: {
        UserSkill: {
          some: {
            skill: {
              skill_type: "digital",
            },
          },
        },
      },
      include: {
        UserSkill: {
          include: {
            skill: true,
          },
        },
      },
    });

    res.send({
      count: usersWithDigitalSkillsPrisma.length,
      data: usersWithDigitalSkillsPrisma,
    });
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});
app.get("/pg", async (req: Request, res: Response) => {
  try {
    const usersWithDigitalSkillsPg = await client.query(
      `
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        json_agg(
            json_build_object(
                'id', s.id,
                'name', s.name,
                'skill_type', s.skill_type
            )
        ) AS skills
      FROM
        "user" u
      JOIN
        "user_skill" us ON u.id = us."userId"
      JOIN
        "skill" s ON us."skillId" = s.id
      GROUP BY
        u.id
      HAVING
        bool_or(s.skill_type = 'digital');
    `
    );

    res.send({
      count: usersWithDigitalSkillsPg.rows.length,
      data: usersWithDigitalSkillsPg.rows,
    });
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});
app.get("prisma-raw", async (req: Request, res: Response) => {
  try {
    const usersWithDigitalSkillsPrismaRaw = await prisma.$queryRaw`
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        json_agg(
            json_build_object(
                'id', s.id,
                'name', s.name,
                'skill_type', s.skill_type
            )
        ) AS skills
      FROM
        "user" u
      JOIN
        "user_skill" us ON u.id = us."userId"
      JOIN
        "skill" s ON us."skillId" = s.id
      GROUP BY
        u.id
      HAVING
        bool_or(s.skill_type = 'digital');
    `;

    res.send({
      // @ts-ignore
      count: usersWithDigitalSkillsPrismaRaw.rows.length,
      // @ts-ignore
      data: usersWithDigitalSkillsPrismaRaw.rows,
    });
  } catch (error) {
    res.status(500).send({ message: "error" });
  }
});
server.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
