import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Step = {
  title: string
  content: string[]
}

type ProviderSteps = {
  [key: string]: {
    title: string
    steps: Step[]
  }
}

const providerSteps: ProviderSteps = {
  aws: {
    title: "Creating an AWS IAM User and Getting Access Keys",
    steps: [
      {
        title: "Log in to AWS",
        content: ["Go to the AWS Management Console.", "Log in with your Root User or Administrator Account."],
      },
      {
        title: "Open IAM (Identity and Access Management)",
        content: [
          'In the search bar at the top of the page, type "IAM" and click on it.',
          "This will take you to the IAM Dashboard.",
        ],
      },
      {
        title: "Create a New User",
        content: ["On the left menu, click Users.", 'Click the "Add users" button at the top of the page.'],
      },
      {
        title: "Set User Details",
        content: [
          "Username: Enter a name for the user (e.g., MyAppUser).",
          'Access Type: Check "Access key – Programmatic access"',
          "Click Next.",
        ],
      },
      {
        title: "Assign Permissions",
        content: [
          "Choose one of the following options:",
          'Option 1 (Simple): Select "Attach existing policies directly". Choose a policy like AdministratorAccess (if you want the user to have full permissions).',
          "Option 2 (Specific): If you want limited access, choose a policy like AmazonS3FullAccess (for S3 only) or another relevant policy.",
          "Click Next.",
        ],
      },
      {
        title: "Review and Create",
        content: ["Review the details on the next screen to ensure everything is correct.", "Click Create user."],
      },
      {
        title: "Save the Access Keys",
        content: [
          "After the user is created, you will see their Access Key ID and Secret Access Key.",
          " Download the CSV file or copy both keys to a secure location (you won't see the Secret Access Key again).",
          "Never share these keys publicly.",
        ],
      },
    ],
  },
  azure: {
    title: "Creating App (Client) ID, Tenant ID, Client Secret, and Finding Subscription ID in Azure",
    steps: [
      {
        title: "Create App (Client) ID and Tenant ID",
        content: [
          "Under Azure Active Directory, click on App registrations in the left-hand menu.",
          "Click New registration.",
          "Provide the following details:",
          "    Name: Enter a name for your app (e.g., MyApp).",
          '    Supported account type: Choose an option (e.g., "Organizational directory").',
          "Click Register.",
          "    App (Client) ID: You'll find this on the app's overview page.",
          "    Tenant ID: This is also available on the app's overview page.",
        ],
      },
      {
        title: "Create a Client Secret",
        content: [
          "In the app registration, go to Certificates & Secrets in the left-hand menu.",
          "Under the Client secrets section, click New client secret.",
          "Provide the following details:",
          "    Description: Enter a description (e.g., MyClientSecret).",
          "    Expiration Period: Choose the validity (e.g., 1 year or 2 years).",
          "Click Add.",
          "    Copy the generated secret value immediately, as it will not be shown again.",
          "    This is your Client Secret.",
        ],
      },
      {
        title: "Find Your Subscription ID",
        content: [
          'In the search bar at the top of the Azure portal, type "Subscriptions".',
          "Click on the Subscriptions service in the search results.",
          "On the Subscriptions page, you will see a list of all subscriptions associated with your account.",
          "    Locate and note your Subscription ID for the relevant subscription",
        ],
      },
    ],
  },
  e2e: {
    title: "Creating an API Access Token on E2E Networks",
    steps: [
      {
        title: "Log in to E2E Networks MyAccount",
        content: [
          "Go to MyAccount and log in using the credentials you set up during account creation and activation.",
        ],
      },
      {
        title: "Navigate to the API Section",
        content: [
          'After logging in, locate the "API" sub-menu under the Products section on the left-hand side of the MyAccount dashboard.',
          "Click on API to open the Manage API page.",
        ],
      },
      {
        title: "Create a New API Token",
        content: [
          'On the Manage API page, click the "Create New Token" button, available at the top-right corner of the API dashboard.',
        ],
      },
      {
        title: "Configure Your API Token",
        content: [
          "A pop-up box labeled 'Add New Token' will appear.",
          "Enter the following details:",
          "Token Name: Provide a desired name for your API token (e.g., MyAPIToken).",
          "Capabilities: Choose the permissions or capabilities you want to assign to this token.",
        ],
      },
      {
        title: "Generate and Save the Token",
        content: [
          "Click on the Generate button.",
          'A message will appear: "Your token is successfully generated."',
          "Copy the generated token immediately and store it securely. You won't be able to view it again.",
        ],
      },
    ],
  },
}

interface CloudProviderDocumentationProps {
  provider: "aws" | "azure" | "e2e"
}

export function Documentation({ provider }: CloudProviderDocumentationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { title, steps } = providerSteps[provider]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-blue-50 text-blue-700 font-semibold text-left flex justify-between items-center hover:bg-blue-100 transition-colors duration-200"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {step.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    {step.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}

