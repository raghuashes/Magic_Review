import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check, Loader2, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { storeService } from '../services/storeService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StoreResponse } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeViewProps {
  storeId?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ storeId: propStoreId }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const storeId = propStoreId || paramId;
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (storeId) {
      loadStore();
    }
  }, [storeId]);

  const loadStore = async () => {
    try {
      const storeData = await storeService.getStore(storeId!);
      setStore(storeData);
      // Generate the public URL
      const baseUrl = window.location.origin;
      setQrCodeUrl(`${baseUrl}/s/${storeData.slug}`);
    } catch (err) {
      addToast('Failed to load store', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!store) return;
    setDownloading(true);
    try {
      const blob = await storeService.getQrCode(store.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${store.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('QR code downloaded', 'success');
    } catch (err) {
      addToast('Failed to download QR code', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!qrCodeUrl) return;
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      setCopied(true);
      addToast('URL copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('Failed to copy URL', 'error');
    }
  };

  const handlePreview = () => {
    if (qrCodeUrl) {
      window.open(qrCodeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Center</h1>
          <p className="text-gray-500 dark:text-gray-400">{store.name} • {store.slug}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <QRCodeSVG
                value={qrCodeUrl}
                size={256}
                level="M"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <div className="text-center w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scan to test</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 break-all font-mono">{qrCodeUrl}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button onClick={handlePreview} className="flex-1 gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Preview
              </Button>
              <Button variant="outline" onClick={handleCopyUrl} className="flex-1 gap-2" disabled={copied}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Download & Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Download & Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button onClick={handleDownload} size="lg" className="w-full gap-2" loading={downloading} disabled={downloading}>
                <Download className="h-5 w-5" />
                {downloading ? 'Preparing...' : 'Download High-Res PNG (512×512)'}
              </Button>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Perfect for printing on receipts, table tents, counter displays, and signage.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">How to Use</h3>
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-medium">1</span>
                  <span>Print the QR code at minimum 3×3 cm (1.2×1.2 in) for reliable scanning.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-medium">2</span>
                  <span>Place at checkout counters, on tables, receipts, packaging, or window displays.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-medium">3</span>
                  <span>Customers scan with their phone camera — no app needed — and get a custom review page.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-medium">4</span>
                  <span>They select their experience, pick a language style, get an AI draft, copy it, and post to Google.</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Target URL</h4>
              <code className="text-sm text-gray-600 dark:text-gray-400 break-all block">{qrCodeUrl}</code>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                This QR code links directly to your store's public review page. If you change the slug, regenerate the QR code.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Branding Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Customer View Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto p-6 rounded-xl border-2" style={{ borderColor: store.primaryColor, backgroundColor: '#fafafa' }}>
            <div className="text-center mb-4">
              {store.logoUrl && (
                <img src={store.logoUrl} alt={store.name} className="h-16 w-auto mx-auto mb-3 rounded" />
              )}
              <h2 className="text-xl font-bold" style={{ color: store.primaryColor }}>{store.name}</h2>
              {store.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{store.description}</p>}
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-400"><strong>Categories:</strong> Jewellery Quality, Service, Pricing</p>
              <p className="text-gray-600 dark:text-gray-400"><strong>Attributes:</strong> Helpful staff, Clear pricing, Clean environment</p>
              <p className="text-gray-600 dark:text-gray-400"><strong>Language Styles:</strong> English, Telugu+English, Hinglish</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button className="w-full" size="lg" style={{ backgroundColor: store.primaryColor }}>
                Generate My Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};