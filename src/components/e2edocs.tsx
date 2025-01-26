import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function E2ENetworksInstructions() {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-lg bg-white">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 px-4 py-4 text-lg rounded-t-lg ">
          How to Create an API Key and Auth Token on E2E Networks
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0 text-base">
          <ol className="list-decimal pl-5 space-y-4">
            <li className="py-2 border-b">
              <h3 className="font-semibold mb-1">Log in to MyAccount</h3>
              <p>Visit  <a href="https://e2enetworks.com/" target="_blank" className="text-blue-700 underline">MyAccount</a> and log in using your credentials.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Go to the API Section</h3>
              <p>Navigate to the  <a href="https://myaccount.e2enetworks.com/services/apiiam" target="_blank" className="text-blue-700 underline">API page</a>.</p>
            </li>
            <li className="pb-2 border-b">
              <h3 className="font-semibold mb-1">Configure and Generate the Token</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Click Create New Token at the top-right corner.</li>
                <li>Enter a token name (e.g., MyAPIToken).</li>
                <li>Assign read and write permissions.</li>
                <li>Click Generate.</li>
              </ul>
            </li>
            <li>
              <h3 className="font-semibold mb-1">Save the Token</h3>
              <p className="font-bold text-red-600">
                Copy the generated API Key and Auth Token immediately and store it securely. It won&apos;t be visible again.
              </p>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

