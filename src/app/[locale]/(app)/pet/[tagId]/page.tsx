import { PublicPetScanView } from "@/features/scan/views/PublicPetScanView";

type PageProps = {
  params: Promise<{
    locale: string;
    tagId: string;
  }>;
};

export default async function PublicPetScanPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicPetScanView tagId={resolvedParams.tagId} />;
}
