import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function E2ENetworksInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 rounded-t-lg">
          How to Create an API Access Token on E2E Networks
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm">
          <ol className="list-decimal pl-5 space-y-4">
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Log in to E2E Networks MyAccount</h3>
              <p>Go to MyAccount and log in using the credentials you set up during account creation and activation.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Navigate to the API Section</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  After logging in, locate the &quot;API&quot; sub-menu under the Products section on the left-hand side of the
                  MyAccount dashboard.
                </li>
                <li>Click on API to open the Manage API page.</li>
              </ul>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Create a New API Token</h3>
              <p>
                On the Manage API page, click the &quot;Create New Token&quot; button, available at the top-right corner of the
                API dashboard.
              </p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Configure Your API Token</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>A pop-up box labeled &quot;Add New Token&quot; will appear.</li>
                <li>
                  Enter the following details:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Token Name: Provide a desired name for your API token (e.g., MyAPIToken).</li>
                    <li>
                      Capabilities: Choose the permissions or capabilities, assign both read and write permissions
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold mb-1">Generate and Save the Token</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Click on the Generate button.</li>
                <li>A message will appear: &quot;Your token is successfully generated.&quot;</li>
                <li className="font-bold text-red-600">
                  Important: Copy the generated token immediately and store it securely. You won&quot;t be able to view it
                  again.
                </li>
              </ul>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

