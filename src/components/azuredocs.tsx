import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AzureAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 text-lg rounded-t-lg">
          Generate Credentials
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0 text-base">
          <ol className="list-decimal pl-5 space-y-4">
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Create Client ID and Tenant ID</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>
                  Go to the{" "}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Azure App Registrations
                  </a>
                  .
                </li>
                <li>Click New Registration and fill in:</li>
                <li>Name: Enter a name (e.g., MyApp).</li>
                <li>Supported account types: Select the appropriate option (e.g., &quot;Organizational directory&quot;).</li>
                <li>Click Register.</li>
                <li>Note down the App (Client) ID and Tenant ID from the overview page.</li>
              </ul>
            </div>
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Create a Client Secret</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>
                  Open your app from{" "}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    App Registrations
                  </a>
                  .
                </li>
                <li>Go to Certificates & Secrets (use the left-hand menu or search bar).</li>
                <li>Under Client Secrets, click New Client Secret and fill in:</li>
                <li>Description: Enter a description (e.g., MyClientSecret).</li>
                <li>Expiration: Select validity (e.g., 1 year).</li>
                <li>Click Add and save the generated secret value securely.</li>
              </ul>
              <p className="font-bold text-red-600 mt-2">
                Important: Copy the generated secret value immediately, as it will not be shown again.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Find Your Subscription ID and Assign Roles</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>
                  Go to the{" "}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Subscriptions Page
                  </a>
                  .
                </li>
                <li>Click on the subscription you want to manage.</li>
                <li>Locate the IAM section and click on Add button to assign roles.</li>
                <li>Select Privileged Administrator Roles and choose the Contributor role.</li>
                <li>Click Next to go to the Select Members step.</li>
                <li>Search for the App you created and add them to the members&apos; list.</li>
                <li>Click Review+assign button.</li>
                <li>
                  Return to the{" "}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Subscriptions Page
                  </a>{" "}
                  and note down the Subscription ID.
                </li>
              </ul>
            </div>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

