import { auth } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const template = await prisma.template.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!template) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  return NextResponse.json(template)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, content } = await req.json()

  const template = await prisma.template.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: { name, content },
  })

  return NextResponse.json(template)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.template.deleteMany({
    where: { id: params.id, userId: session.user.id },
  })

  return new Response(null, { status: 204 })
}
