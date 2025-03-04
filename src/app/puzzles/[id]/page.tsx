// /app/puzzles/[id]/page.tsx

import PuzzleClient from './PuzzleClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PuzzlePage({ params }: PageProps) {
  const { id } = await params
  return <PuzzleClient id={id} />
}
