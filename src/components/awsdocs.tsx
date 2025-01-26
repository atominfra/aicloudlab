import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AWSAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white ">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-2 rounded-t-lg py-4">
          How to Create an AWS Access Key ID and Secret Access Key
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm">
          <ol className="list-decimal pl-5 space-y-4">
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Log In to AWS</h3>
              <p>Log in to the AWS Management Console using your Root or Administrator account.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Access IAM Dashboard</h3>
              <p>Search for IAM in the AWS Console and open the IAM Dashboard.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Add a New User</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Navigate to Users &gt; Add Users.</li>
                <li>Enter a username (e.g., MyAppUser).</li>
                <li>Enable "Provide user access to the AWS Management Console".</li>
                <li>Select "I want to create an IAM user" and click Next.</li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Set Permissions and Create a Custom Policy</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Under Set Permissions, choose Attach policies directly and click Create policy (opens in a new tab).
                </li>
                <li>In the Create Policy wizard:</li>
                <li>Select Service &gt; EC2.</li>
                <li>Go to the JSON tab, delete the existing content, and paste the following:</li>
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
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide a name for the policy (e.g., PricingAccessPolicy) and click Create policy.</li>
                <li>Tip: AWS will notify you once the policy is successfully created.</li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Attach the Custom Policy to the User</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Return to the IAM User creation tab.</li>
                <li>Refresh the policy list and search for your policy name (PricingAccessPolicy).</li>
                <li>Select the policy and click Next.</li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Review and Create the User</h3>
              <p>Review the user details and click Create User.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Generate an Access Key</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Go back to Users in the IAM Dashboard and select the user you just created.</li>
                <li>Under the Security credentials section, choose Create access key.</li>
                <li>Select Other under Access key best practices & alternatives and click Next.</li>
                <li>Add an optional Description if needed and click Create access key.</li>
                <li>AWS will generate the Access Key ID and Secret Access Key.</li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold mb-1">Download and Save the Keys</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Download the keys as a CSV file or copy them securely.</li>
                <li className="font-bold text-red-600">
                  Important: The Secret Access Key won't be shown again, so ensure it is saved securely.
                </li>
              </ul>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

