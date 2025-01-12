import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const issueId = parseInt(params.id);

  if (isNaN(issueId)) {
    return NextResponse.json({ message: "Invalid issue ID" }, { status: 400 });
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  });

  if (!issue) {
    return NextResponse.json({ message: "Issue not found" }, { status: 404 });
  }

  if (!request.body) {
    return NextResponse.json({ message: "Request body is missing" }, { status: 400 });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: await request.json()
  });

  return NextResponse.json(updatedIssue, { status: 200 });
}



export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const issueId = parseInt(params.id);

  if (isNaN(issueId)) {
    return NextResponse.json({ message: "Invalid issue ID" }, { status: 400 });
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  });

  if (!issue) {
    return NextResponse.json({ message: "Issue not found" }, { status: 404 });
  }

  await prisma.issue.delete({
    where: { id: issueId }
  });

  return NextResponse.json({ message: "Issue deleted" }, { status: 200 });
}