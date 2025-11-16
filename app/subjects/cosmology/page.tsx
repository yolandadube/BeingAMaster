'use client';

import SubjectLayout from '@/components/subjects/SubjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Telescope, Orbit } from 'lucide-react';

export default function CosmologyPage() {
  const researchAreas = [
    'Dark Matter',
    'Dark Energy',
    'Cosmic Microwave Background',
    'Galaxy Formation',
    'Large Scale Structure',
    'Inflation Theory',
  ];

  const specialContent = (
    <div className="space-y-6">
      {/* Research Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Orbit size={20} />
            Active Research Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {researchAreas.map((area) => (
              <div
                key={area}
                className="p-4 bg-gray-medium rounded hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium">{area}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cosmological Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Key Cosmological Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-medium rounded">
              <span className="text-gray-300">Hubble Constant (H₀)</span>
              <span className="text-gold font-mono">~70 km/s/Mpc</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-medium rounded">
              <span className="text-gray-300">Age of Universe</span>
              <span className="text-gold font-mono">~13.8 Gyr</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-medium rounded">
              <span className="text-gray-300">Dark Energy Density (Ωₐ)</span>
              <span className="text-gold font-mono">~0.68</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-medium rounded">
              <span className="text-gray-300">Dark Matter Density (Ωₘ)</span>
              <span className="text-gold font-mono">~0.32</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCMC Analysis Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-medium rounded">
              <p className="text-white font-medium mb-1">Parameter Estimation - Galaxy Clustering</p>
              <p className="text-sm text-gray-400">MCMC chains converged, analyzing posterior distributions</p>
            </div>
            <div className="p-3 bg-gray-medium rounded">
              <p className="text-white font-medium mb-1">CMB Power Spectrum Analysis</p>
              <p className="text-sm text-gray-400">Fitting cosmological parameters to Planck data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers to Read */}
      <Card>
        <CardHeader>
          <CardTitle>Papers Reading List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span className="text-sm">Latest results from James Webb Space Telescope observations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span className="text-sm">Dark energy constraints from Type Ia supernovae</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span className="text-sm">Gravitational lensing and structure formation</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SubjectLayout
      subject="Cosmology"
      icon={<Telescope size={48} />}
      description="Study of the origin, evolution, and ultimate fate of the universe"
      specialContent={specialContent}
    />
  );
}
