import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AzureAccountInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4  rounded-t-lg py-4">
          How to Configure App Registration in Azure
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm">
          <ol className="list-decimal pl-5 space-y-4">
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Create App (Client) ID and Tenant ID</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Go to Azure Active Directory in the Azure portal or use the search bar at the top and type &quot;App
                  registrations&quot;.
                </li>
                <li>Click on App registrations.</li>
                <li>
                  Select New registration and fill in the following details:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Name: Provide a name for your app (e.g., MyApp).</li>
                    <li>Supported account types: Choose the appropriate option (e.g., &quot;Organizational directory&quot;).</li>
                  </ul>
                </li>
                <li>Click Register.</li>
                <li>
                  Note down the following from the app&apos;s overview page:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>App (Client) ID</li>
                    <li>Tenant ID</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Create a Client Secret</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Open the app you just created by selecting it from App registrations.</li>
                <li>In the left-hand menu, go to Certificates & Secrets, or use the search bar at the top.</li>
                <li>Under the Client secrets section, click New client secret.</li>
                <li>
                  Provide the following details:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Description: Add a description (e.g., MyClientSecret).</li>
                    <li>Expiration: Select the validity period (e.g., 1 year or 2 years).</li>
                  </ul>
                </li>
                <li>Click Add.</li>
                <li className="font-bold text-red-600">
                  Important: Copy the generated secret value immediately, as it will not be shown again. This value is
                  your Client Secret.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold mb-1">Find Your Subscription ID</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>In the Azure portal search bar, type &quot;Subscriptions&quot;.</li>
                <li>Select Subscriptions from the search results.</li>
                <li>
                  On the Subscriptions page, you will see a list of all subscriptions associated with your account.
                </li>
                <li>Note down the Subscription ID for your desired subscription.</li>
              </ul>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

