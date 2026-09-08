import PsychologyStructurePage from '@/app/(Frond-End)/_components/adminDashboard/categories/psychology/PsychologyStructurePage'

interface PsychologyPageProps {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
}

export default async function Page({ searchParams }: PsychologyPageProps) {
  const { tab } = await searchParams;
  const activeTab = Array.isArray(tab) ? tab[0] : tab;

  return <PsychologyStructurePage activeTab={activeTab} />;
}
