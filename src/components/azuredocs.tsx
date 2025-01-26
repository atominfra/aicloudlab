import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AzureAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 text-lg rounded-t-lg">
        Configure Client ID, Tenant ID, Client Secret, and Subscription ID
        </AccordionTrigger>
        <AccordionContent className="p-6  pt-0 text-base">
          <ol className="list-decimal pl-5 space-y-4">
            <li className="py-2 border-b">
              <h3 className="font-semibold mb-1">Create App (Client) ID and Tenant ID</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Go to the <a href="https://myaccount.e2enetworks.com/services/apiiam" target="_blank" className="text-blue-700 underline">Azure App Registrations</a>.</li>
                <li>
                  Click New Registration and fill in:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Name: Enter a name (e.g., MyApp).</li>
                    <li>Supported account types: Select the appropriate option (e.g., "Organizational directory").</li>
                  </ul>
                </li>
                <li>Click Register.</li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Create a Client Secret</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Open your app from <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" className="text-blue-700 underline">App Registrations</a>.</li>
                <li>Go to Certificates & Secrets (use the left-hand menu or search bar).</li>
                <li>
                  Under Client Secrets, click New Client Secret and fill in:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Description: Enter a description (e.g., MyClientSecret).</li>
                    <li>Expiration: Select validity (e.g., 1 year).</li>
                  </ul>
                </li>
                <li>Click Add and save the generated secret securely.</li>
                <li className="font-bold text-red-600">
                  Important: Copy the generated secret value immediately, as it will not be shown again.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold mb-1">Find Your Subscription ID</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Go to the  <a href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2" target="_blank" className="text-blue-700 underline">Subscriptions Page</a> to find subscription ID.</li>
              </ul>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

