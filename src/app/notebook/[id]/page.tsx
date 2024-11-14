'use client'

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import withAuth from '@/components/withAuth';
import { useParams } from 'next/navigation';

const NotebookPage = () => {
  const { id } = useParams();  // Get notebook id from params
  const [notebookLink, setNotebookLink] = useState(null);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          });
        if (response.ok) {
          const data = await response.json();
          console.log("data",data.data.notebook.notebook_url)
          setNotebookLink(data.data.notebook.notebook_url);  
        } else {
          console.error('Failed to fetch notebook data');
        }
      } catch (error) {
        console.error('Error fetching notebook:', error);
      }
    };

    fetchNotebook();
  }, [id]);

  useEffect(()=>{
    console.log("id",id)
    console.log("notebookLink",notebookLink)
  })
  return (
    <div className="flex h-screen">
      <div className="w-full">
        {notebookLink && (
          <iframe
            src={notebookLink}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
            title="Notebook"
          />
        )}
      </div>
    </div>
  );
}

export default withAuth(NotebookPage);
