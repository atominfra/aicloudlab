import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AWSAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 text-lg rounded-t-lg">
          Generate Credentials
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0 text-base">
          <ol className="list-decimal pl-5 space-y-4">
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Log in to AWS</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>
                  Log in to the{" "}
                  <a
                    href="https://aws.amazon.com/console/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    AWS Management Console
                  </a>
                  .
                </li>
              </ul>
            </div>
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Access IAM Dashboard</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>
                  Go to the{" "}
                  <a
                    href="https://us-east-1.console.aws.amazon.com/iam/home?region=ap-south-1#/users"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    IAM Dashboard
                  </a>
                  .
                </li>
                <li>Navigate to Users &gt; Add Users.</li>
                <li>Enter a username (e.g., MyAppUser) and enable AWS Management Console access.</li>
              </ul>
            </div>
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Create a Custom Policy</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Go to Set Permissions and click Create Policy.</li>
                <li>In the Create Policy wizard, select EC2 service and add the following JSON:</li>
              </ul>
              <pre className="bg-gray-100 p-3 rounded-md mt-2 text-xs overflow-x-auto">
                {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "pricing:DescribeServices",
        "pricing:GetAttributeValues",
        "pricing:GetProducts"
      ],
      "Resource": "*"
    }
  ]
}`}
              </pre>
              <ul className="list-disc pl-10 mt-2 space-y-1">
                <li>Name it PricingAccessPolicy and click Create policy.</li>
              </ul>
            </div>
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Attach Policy to User</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Return to the IAM user creation tab.</li>
                <li>
                  Attach the PricingAccessPolicy and AmazonEC2FullAccess to the user in the IAM User Creation tab.
                </li>
                <li>Review the user details and click Create User.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Generate Access Key</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Select the created user, go to Security credentials, and click Create access key.</li>
                <li>Click Next, add an optional description, and click Create access key.</li>
              </ul>
              <p className="font-bold text-red-600 mt-2">
                Important: Copy the Access Key ID and Secret Access Key immediately and store them securely. The Secret
                Access Key won&apos;t be shown again.
              </p>
            </div>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

