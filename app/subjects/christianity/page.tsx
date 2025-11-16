'use client';

import SubjectLayout from '@/components/subjects/SubjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Cross, Book } from 'lucide-react';

export default function ChristianityPage() {
  const bibleReadingPlan = [
    { book: 'Genesis', chapters: '1-5', status: 'completed' },
    { book: 'Exodus', chapters: '1-3', status: 'in-progress' },
    { book: 'Matthew', chapters: '1-7', status: 'upcoming' },
  ];

  const specialContent = (
    <div className="space-y-6">
      {/* Bible Reading Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book size={20} />
            Bible Reading Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bibleReadingPlan.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-medium rounded">
                <div>
                  <p className="font-semibold text-white">{item.book}</p>
                  <p className="text-sm text-gray-400">Chapters {item.chapters}</p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded ${
                    item.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : item.status === 'in-progress'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {item.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Devotion */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-gold pl-4">
              <p className="text-gray-300 italic mb-2">
                &quot;For God so loved the world that he gave his one and only Son, 
                that whoever believes in him shall not perish but have eternal life.&quot;
              </p>
              <p className="text-gold text-sm">— John 3:16</p>
            </div>
            <p className="text-gray-400 text-sm">
              Take time today to reflect on God&apos;s love and sacrifice. How does this verse 
              impact your understanding of grace and salvation?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SubjectLayout
      subject="Christianity"
      icon={<Cross size={48} />}
      description="Study of Christian theology, Scripture, apologetics, and spiritual formation"
      specialContent={specialContent}
    />
  );
}
