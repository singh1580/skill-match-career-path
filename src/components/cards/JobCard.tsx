
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  isEmployerView?: boolean;
}

export function JobCard({ job, isEmployerView = false }: JobCardProps) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
          {job.status === 'active' ? 'Active' : 'Closed'}
        </Badge>
      </div>
      <p className="text-platformBlue font-medium mb-1">{job.company}</p>
      <p className="text-gray-500 mb-4">{job.location}</p>
      
      <div className="mb-4">
        <p className="text-gray-700 line-clamp-2">{job.description}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Required:</h4>
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Posted: {new Date(job.createdAt).toLocaleDateString()}
        </div>
        
        {isEmployerView ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              {job.applications || 0} Applications
            </span>
            <Link to={`/employer/jobs/${job.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        ) : (
          <Link to={`/jobs/${job.id}`}>
            <Button size="sm">View & Apply</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
