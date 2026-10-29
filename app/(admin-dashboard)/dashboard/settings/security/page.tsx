import LoginActivityTable from "@/app/(Front-End)/_components/adminDashboard/settings/LoginActivityTable";
import SecuritySettings from "@/app/(Front-End)/_components/adminDashboard/settings/SecuritySetting";

export default function page() {
  return (
    <div>
      <SecuritySettings />
      <div>
        <LoginActivityTable />
      </div>
    </div>
  );
}
