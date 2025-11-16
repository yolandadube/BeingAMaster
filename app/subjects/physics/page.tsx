'use client';

import SubjectLayout from '@/components/subjects/SubjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Atom, Zap } from 'lucide-react';

export default function PhysicsPage() {
  const physicsFields = [
    { name: 'Classical Mechanics', icon: '⚙️' },
    { name: 'Electromagnetism', icon: '⚡' },
    { name: 'Thermodynamics', icon: '🔥' },
    { name: 'Quantum Mechanics', icon: '🔬' },
    { name: 'Relativity', icon: '🌌' },
    { name: 'Statistical Mechanics', icon: '📊' },
  ];

  const specialContent = (
    <div className="space-y-6">
      {/* Physics Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap size={20} />
            Fields of Study
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {physicsFields.map((field) => (
              <div
                key={field.name}
                className="p-4 bg-gray-medium rounded flex items-center gap-3 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span className="text-2xl">{field.icon}</span>
                <p className="text-white font-medium">{field.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Equation */}
      <Card>
        <CardHeader>
          <CardTitle>Fundamental Equation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-3xl text-gold mb-4">
              <em>E</em> = <em>mc</em>
              <sup className="text-2xl">2</sup>
            </p>
            <p className="text-gray-400 text-sm">
              Einstein&apos;s mass-energy equivalence - One of the most famous equations in physics
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem Solving Journal */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Derivations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-medium rounded">
              <p className="text-white font-medium mb-1">Maxwell&apos;s Equations Derivation</p>
              <p className="text-sm text-gray-400">Completed electromagnetic field theory problems</p>
            </div>
            <div className="p-3 bg-gray-medium rounded">
              <p className="text-white font-medium mb-1">Wave Equation Solutions</p>
              <p className="text-sm text-gray-400">Working through boundary value problems</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SubjectLayout
      subject="Physics"
      icon={<Atom size={48} />}
      description="Study of matter, energy, space, time, and the fundamental forces of nature"
      specialContent={specialContent}
    />
  );
}
