interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-500';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
}
