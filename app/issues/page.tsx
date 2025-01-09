import { prisma } from "@/prisma/client";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusBadge from "../components/IssueStatusBadge";
import delay from "delay";
const IssuesPage = async () => {
  const issue = await prisma.issue.findMany();
  await delay(2000);
  

  return (
    <div>
      <div className="mb-5">
        <Button>
          <Link href="/issues/new"> New Issue </Link>
        </Button>
      </div>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell> SL</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell> Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell> Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell> Created</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issue.map((issue, i) => (
            <Table.Row key={i}>
              <Table.Cell>
                <div className="">{i + 1}</div>
              </Table.Cell>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default IssuesPage;
