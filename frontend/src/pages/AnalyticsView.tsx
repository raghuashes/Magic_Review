import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, TrendingUp, Eye, MousePointer2, Link2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { storeService } from '../services/storeService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AnalyticsResponse } from '../types';
import { cn, formatDate } from '../utils/helpers';

interface AnalyticsViewProps {
  storeId?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ storeId: propStoreId }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const storeId = propStoreId || paramId;
  const [store, setStore] = useState<{ name: string; slug: string } | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (storeId) {
      loadData();
    }
  }, [storeId, timeRange]);

  const loadData = async () => {
    try {
      const [storeData, analyticsData] = await Promise.all([
        storeService.getStore(storeId!),
        storeService.getAnalytics(storeId!),
      ]);
      setStore({ name: storeData.name, slug: storeData.slug });
      setAnalytics(analyticsData);
    } catch (err) {
      addToast('Failed to load analytics', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = (data: Record<string, number>) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return Object.entries(data)
      .filter(([date]) => date >= cutoffStr)
      .sort(([a], [b]) => a.localeCompare(b));
  };

  const getTotalForRange = (data: Record<string, number>) => {
    return getFilteredData(data).reduce((sum, [, value]) => sum + value, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!analytics || !store) return null;

  const visitsData = getFilteredData(analytics.visitsByDay);
  const draftsData = getFilteredData(analytics.draftsByDay);
  const clicksData = getFilteredData(analytics.clicksByDay);

  const totalVisits = getTotalForRange(analytics.visitsByDay);
  const totalDrafts = getTotalForRange(analytics.draftsByDay);
  const totalClicks = getTotalForRange(analytics.clicksByDay);

  const conversionRate = totalVisits > 0 ? ((totalDrafts / totalVisits) * 100).toFixed(1) : '0';
  const clickThroughRate = totalDrafts > 0 ? ((totalClicks / totalDrafts) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">{store.name} • Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Time range:</span>
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              timeRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Page Visits</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalVisits.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reviews Generated</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalDrafts.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <MousePointer2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Google Link Clicks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{conversionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" style={{ position: 'relative' }}>
              {/* Simple bar chart using divs */}
              <div className="flex items-end justify-between h-full gap-1 px-2">
                {visitsData.map(([date, visits]) => {
                  const drafts = draftsData.find(([d]) => d === date)?.[1] || 0;
                  const clicks = clicksData.find(([d]) => d === date)?.[1] || 0;
                  const maxVal = Math.max(...visitsData.map(([, v]) => v), 1);

                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <div className="flex gap-1 h-full items-end w-full">
                        <div
                          className="flex-1 bg-blue-500 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${(visits / maxVal) * 100}%`, minHeight: visits > 0 ? '4px' : '0' }}
                          title={`Visits: ${visits}`}
                        />
                        <div
                          className="flex-1 bg-green-500 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${(drafts / maxVal) * 100}%`, minHeight: drafts > 0 ? '4px' : '0' }}
                          title={`Drafts: ${drafts}`}
                        />
                        <div
                          className="flex-1 bg-purple-500 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${(clicks / maxVal) * 100}%`, minHeight: clicks > 0 ? '4px' : '0' }}
                          title={`Clicks: ${clicks}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45 origin-top whitespace-nowrap">
                        {formatDate(date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Visits</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> Drafts</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500" /> Clicks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Page Visits</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalVisits.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Reviews Generated</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalDrafts.toLocaleString()} ({conversionRate}%)</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: totalVisits > 0 ? `${(totalDrafts / totalVisits) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Google Link Clicks</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalClicks.toLocaleString()} ({clickThroughRate}%)</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: totalDrafts > 0 ? `${(totalClicks / totalDrafts) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Funnel shows the journey from page visit → review draft → Google review click
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No activity yet. Share your QR code to start collecting data!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentEvents.slice(0, 20).map((event, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-3 text-gray-600 dark:text-gray-400">{formatDate(event.timestamp)}</td>
                      <td className="py-3">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          event.eventType === 'PAGE_VIEW' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                          event.eventType === 'DRAFT_GENERATED' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                          event.eventType === 'GOOGLE_LINK_CLICKED' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        )}>
                          {event.eventType.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};