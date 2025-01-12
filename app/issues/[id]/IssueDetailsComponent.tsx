import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import { Issue } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
const IssueDetailsComponent = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex className="space-x-3" my="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full" mt="4">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {issue.description}
      </ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetailsComponent;