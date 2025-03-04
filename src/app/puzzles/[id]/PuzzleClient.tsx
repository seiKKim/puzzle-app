"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";

interface PuzzleClientProps {
  id: string;
}

export default function PuzzleClient({ id }: PuzzleClientProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPuzzleData = useCallback(async () => {
    try {
      const response = await fetch(`/api/puzzle/${id}`);

      console.log("API Response:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch puzzle data");
      }
      const data = await response.json();

      console.log("data", data)

      setImageSrc(data.imageSrc);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching puzzle data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPuzzleData();
  }, [fetchPuzzleData]);

  if (loading) {
    return <p>Loading puzzle...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Puzzle ID: {id}</h1>
      {imageSrc && (
        <>
          <Image src={imageSrc} alt="Puzzle" width={300} height={300} />
          <p>Image URL: {imageSrc}</p>
        </>
      )}
    </div>
  );
}
