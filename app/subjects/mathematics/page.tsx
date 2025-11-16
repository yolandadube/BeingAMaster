'use client';

import SubjectLayout from '@/components/subjects/SubjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Calculator, Award } from 'lucide-react';

export default function MathematicsPage() {
  const topics = [
    'Calculus',
    'Linear Algebra',
    'Differential Equations',
    'Real Analysis',
    'Abstract Algebra',
    'Topology',
  ];

  const specialContent = (
    <div className="space-y-6">
      {/* Study Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Active Study Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <div
                key={topic}
                className="p-3 bg-gray-medium rounded text-center hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium">{topic}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Formula */}
      <Card>
        <CardHeader>
          <CardTitle>Beautiful Mathematics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-3xl text-gold mb-4">
              <em>e</em>
              <sup className="text-2xl">
                <em>iπ</em>
              </sup>
              {' + 1 = 0'}
            </p>
            <p className="text-gray-400 text-sm">Euler&apos;s Identity - The most beautiful equation in mathematics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SubjectLayout
      subject="Mathematics"
      icon={<Calculator size={48} />}
      description="Study of numbers, quantities, shapes, and patterns through rigorous logical reasoning"
      specialContent={specialContent}
    />
  );
}
