'use client';

import SubjectLayout from '@/components/subjects/SubjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Brain, Lightbulb } from 'lucide-react';

export default function PhilosophyPage() {
  const philosophicalConcepts = [
    { name: 'Epistemology', description: 'Theory of knowledge' },
    { name: 'Metaphysics', description: 'Nature of reality' },
    { name: 'Ethics', description: 'Moral philosophy' },
    { name: 'Logic', description: 'Principles of reasoning' },
  ];

  const specialContent = (
    <div className="space-y-6">
      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb size={20} />
            Key Philosophical Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {philosophicalConcepts.map((concept) => (
              <div key={concept.name} className="p-4 bg-gray-medium rounded">
                <h4 className="font-semibold text-white mb-1">{concept.name}</h4>
                <p className="text-sm text-gray-400">{concept.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Philosophical Quote */}
      <Card>
        <CardHeader>
          <CardTitle>Thought of the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-l-4 border-gold pl-4">
            <p className="text-gray-300 italic mb-2">
              &quot;The unexamined life is not worth living.&quot;
            </p>
            <p className="text-gold text-sm">— Socrates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SubjectLayout
      subject="Philosophy"
      icon={<Brain size={48} />}
      description="Exploration of fundamental questions about existence, knowledge, values, reason, and reality"
      specialContent={specialContent}
    />
  );
}
