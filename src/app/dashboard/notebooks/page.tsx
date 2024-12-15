"use client";

import { Button } from "@/components/ui/button";
import { NotebookCard } from "@/components/notebook-card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/global-context";
import CreditsModal from "@/components/modals/creditsModal";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import notebook from "@/assets/notebook.png";
import { fetchNotebooksAPI, handleOperationRequestAPI } from "@/app/api/notebooks/api";

export default function NotebooksPage() {
  const router = useRouter();
  const { notebooks, setNotebooks, user, fetchUserDetails, auth } = useGlobal();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCreateClick = () => {
    // if (user?.credits < 1) {
    //   setShowModal(true);
    // } else {
      router.push('/create/notebook');
    // }
  };

  const fetchNotebooks = async () => {
    setLoading(true);
    try {
      const response = await fetchNotebooksAPI(auth);
      setNotebooks(response.data.notebooks);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching notebooks');
    } finally {
      setLoading(false);
    }
  };

  const handleOperationRequest = async (notebookId: string, operationName: string) => {
    try {
      await handleOperationRequestAPI(auth, notebookId, operationName);
      if (operationName === 'delete') {
        await fetchNotebooks();
        await fetchUserDetails();
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  useEffect(() => {
    fetchNotebooks();
    fetchUserDetails();
  }, []);

  return (
    <div className="p-6 bg-neutral-100 h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notebooks</h1>
        <Button className="bg-blue-600" onClick={handleCreateClick}>
          <span className="mr-2">+</span>
          Create
        </Button>
      </div>
      {notebooks.length === 0 ? (
        <Box className="flex flex-col gap-2 justify-center items-center h-[60vh] w-full bg-neutral-100">
          <Image
            src={notebook}
            width={1000}
            height={1000}
            className="w-[100px] h-[100px] text-neutral-100"
            alt="AI Cloud Lab Logo"
          />
          <Typography variant="body1" className="text-gray-400 mb-4 px-6">
            No notebooks yet.
          </Typography>
        </Box>
      ) : (
        <div>
          {notebooks.map((notebook) => (
            <NotebookCard
              key={notebook.id}
              {...notebook}
              onOperation={handleOperationRequest}
            />
          ))}
        </div>
      )}
      <CreditsModal showModal={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
