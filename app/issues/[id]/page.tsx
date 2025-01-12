
import { prisma } from "@/prisma/client";
import { Box,  Flex, Grid  } from "@radix-ui/themes";
import delay from "delay";
import { notFound } from "next/navigation";
import React from "react";

import IssueDetailsComponent from "./IssueDetailsComponent";
import EditIssueButton from "./EditIssueButton";
import DeleteIssueButton from "./DeleteIssueButton";
interface IssueDetailsProps {
  params: {
    id: string;
  };
}

const IssueDetails = async ({ params }: IssueDetailsProps) => {
  const issueId =  parseInt(params.id);
  await delay(1000);

  if (isNaN(issueId)) {
    notFound();
  }

  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    notFound();
  }

  return (
    <div>
     <Grid columns={{ initial: '1', sm: '5' }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetailsComponent issue={issue} />
      </Box>
      
        <Box>
          <Flex direction="column" gap="4">
            {/* <AssigneeSelect issue={issue} /> */}
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
   
    </Grid>
    </div>
  );
};

export default IssueDetails;