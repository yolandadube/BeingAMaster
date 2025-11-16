export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getProgressPercentage(progress: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((progress / total) * 100);
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Christianity: 'text-blue-400',
    Philosophy: 'text-purple-400',
    Mathematics: 'text-green-400',
    Physics: 'text-red-400',
    Cosmology: 'text-indigo-400',
  };
  return colors[subject] || 'text-gold';
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-orange-500',
    expert: 'text-red-500',
  };
  return colors[difficulty] || 'text-gray-500';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
