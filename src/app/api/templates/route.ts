import { auth } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
  })

  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, content } = await req.json()

  const template = await prisma.template.create({
    data: {
      name,
      content,
      userId: session.user.id,
    },
  })

  return NextResponse.json(template)
}
