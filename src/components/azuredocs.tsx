import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AzureAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 text-lg rounded-t-lg">
        Generate Credentials
        </AccordionTrigger>
        <AccordionContent className="p-6  pt-0 text-base">
          <ol className="list-decimal pl-5 space-y-4">
            <div className="py-2 border-b">
              <h3 className="font-semibold mb-1">Create App (Client) ID and Tenant ID</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Go to the <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" className="text-blue-700 underline">Azure App Registrations</a>.</li>
                <li>
                  Click New Registration and fill in:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Name: Enter a name (e.g., MyApp).</li>
                    <li>Account Type: Select Default Directory only -  Single Tenant</li>
                    <li>Skip redirect URI</li>
                  </ul>
                </li>
                <li>Click Register.</li>
              </ul>
            </div>
            <div className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Create a Client Secret</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Open your app from <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" className="text-blue-700 underline">App Registrations</a>.</li>
                <li>Go to Certificates & Secrets (use the left-hand menu or search bar).</li>
                <li>
                  Under Client Secrets, click New Client Secret :
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Description: Enter a description (e.g., MyClientSecret).</li>
                    <li>Expiration: Select validity (e.g., 365 days (12 months)).</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Find Your Subscription ID</h3>
              <ul className="list-disc pl-10 mt-1 space-y-1">
                <li>Go to the  <a href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2" target="_blank" className="text-blue-700 underline">Subscriptions Page</a> to find subscription ID.</li>
              </ul>
            </div>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

