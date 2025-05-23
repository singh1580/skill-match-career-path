
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProfileSection } from '@/components/dashboard/student/ProfileSection';
import { SkillsSection } from '@/components/dashboard/student/SkillsSection';
import { JobSearchSection } from '@/components/dashboard/student/JobSearchSection';
import { AppliedJobsSection } from '@/components/dashboard/student/AppliedJobsSection';
import { RecommendedJobsSection } from '@/components/dashboard/student/RecommendedJobsSection';
import { NotificationsSection } from '@/components/dashboard/student/NotificationsSection';

export default function StudentDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar userRole="student" />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <Button>Update Profile</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <SkillsSection />
            <JobSearchSection />
            <AppliedJobsSection />
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            <ProfileSection />
            <NotificationsSection />
            <RecommendedJobsSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
