import { BreedDetailView } from "@/features/dogs/views/BreedDetailView";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function BreedDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <BreedDetailView slug={resolvedParams.slug} />;
}
