import NeuroscienceStructurePage from '@/app/(Frond-End)/_components/adminDashboard/categories/neuroscience/NeuroscienceStructurePage'

interface NeurosciencePageProps {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
}

export default async function Page({ searchParams }: NeurosciencePageProps) {
  const { tab } = await searchParams;
  const activeTab = Array.isArray(tab) ? tab[0] : tab;

  return <NeuroscienceStructurePage activeTab={activeTab} />;
}
